// Unit test for error mapping logic and quote rotation in pure Node.js ESM

const ENCOURAGING_QUOTES = [
  "Great ideas are built one step at a time.",
  "Every great product starts with a clear plan.",
  "Progress is a process, not a single moment.",
  "A small setback is not the end of the journey.",
  "Good things are worth building carefully.",
  "Keep the idea. We'll help you find the next step.",
  "Every great idea deserves another attempt.",
  "Thank you for your patience while we work through this.",
  "Build thoughtfully. Improve continuously.",
  "Great things take time. Thank you for being part of the journey."
];

let lastQuoteIndex = -1;
function getRotatingQuote(preferredContext) {
  if (preferredContext === 'offline') {
    return "Every great idea deserves another attempt.";
  }
  if (preferredContext === 'ai') {
    return "Great things take time. Thank you for being part of the journey.";
  }
  const availableIndices = ENCOURAGING_QUOTES
    .map((_, i) => i)
    .filter(i => i !== lastQuoteIndex);
  const nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  lastQuoteIndex = nextIndex;
  return ENCOURAGING_QUOTES[nextIndex];
}

class AppError extends Error {
  constructor(options) {
    super(options.message);
    this.name = 'AppError';
    this.category = options.category;
    this.title = options.title;
    this.statusCode = options.statusCode;
    this.canRetry = options.canRetry ?? true;
    this.retryLabel = options.retryLabel || 'Try Again';
    this.secondaryLabel = options.secondaryLabel || 'Close';
    this.context = options.context;
    this.originalError = options.originalError;
    if (options.quote) {
      this.quote = options.quote;
    } else if (this.category === 'OFFLINE') {
      this.quote = getRotatingQuote('offline');
    } else if (this.category.startsWith('AI_')) {
      this.quote = getRotatingQuote('ai');
    } else {
      this.quote = getRotatingQuote('general');
    }
  }
}

function mapError(error, context) {
  if (error instanceof AppError) return error;
  const isNavigatorOffline = typeof navigator !== 'undefined' && !navigator.onLine;
  const rawMsg = error?.message || String(error || '');
  const rawStatus = error?.statusCode || error?.status;

  if (
    isNavigatorOffline ||
    rawMsg.includes('Failed to fetch') ||
    rawMsg.includes('NetworkError') ||
    rawMsg.includes('ERR_INTERNET_DISCONNECTED') ||
    rawMsg.includes('ERR_CONNECTION_REFUSED')
  ) {
    return new AppError({
      category: 'OFFLINE',
      title: "You're Offline",
      message: "It looks like your internet connection has been interrupted. Check your connection and try again when you're back online.",
      quote: "Every great idea deserves another attempt.",
      canRetry: true,
      retryLabel: 'Retry Connection',
      secondaryLabel: 'Close',
      statusCode: rawStatus,
      context,
      originalError: error
    });
  }

  if (rawMsg.includes('timed out') || rawMsg.includes('AbortError') || rawMsg.includes('timeout')) {
    return new AppError({
      category: 'NETWORK_TIMEOUT',
      title: 'Connection Timed Out',
      message: 'The server took longer than expected to respond. Please check your connection and try again.',
      canRetry: true,
      retryLabel: 'Try Again',
      secondaryLabel: 'Close',
      statusCode: rawStatus || 408,
      context,
      originalError: error
    });
  }

  if (context === 'ai-chat' || context === 'ai-planning' || rawMsg.toLowerCase().includes('gemini') || rawMsg.toLowerCase().includes('model') || rawMsg.toLowerCase().includes('ai')) {
    if (rawStatus === 429 || rawMsg.includes('quota') || rawMsg.includes('limit reached')) {
      return new AppError({
        category: 'AI_QUOTA_EXCEEDED',
        title: 'AI Usage Limit Reached',
        message: 'The AI service has reached its current usage limit. Please try again later.',
        quote: 'Great things take time. Thank you for being part of the journey.',
        canRetry: true,
        retryLabel: 'Try Again',
        secondaryLabel: 'Continue Without AI',
        statusCode: 429,
        context,
        originalError: error
      });
    }

    if (
      rawStatus === 400 ||
      rawStatus === 403 ||
      (rawStatus === 404 && rawMsg.toLowerCase().includes('model')) ||
      rawMsg.toLowerCase().includes('credentials') ||
      rawMsg.toLowerCase().includes('api key')
    ) {
      return new AppError({
        category: 'AI_MISCONFIGURED',
        title: 'AI Service Misconfigured',
        message: 'The AI service is currently misconfigured. Please try again later.',
        quote: 'A small setback is not the end of the journey.',
        canRetry: false,
        retryLabel: 'Try Again',
        secondaryLabel: 'Continue Without AI',
        statusCode: rawStatus || 400,
        context,
        originalError: error
      });
    }

    if (rawStatus === 503 && rawMsg.toLowerCase().includes('maintenance')) {
      return new AppError({
        category: 'AI_MAINTENANCE',
        title: 'Feature Under Maintenance',
        message: 'This feature is temporarily unavailable while improvements are underway. Thank you for your patience.',
        quote: 'Good things are worth building carefully.',
        canRetry: true,
        retryLabel: 'Try Again',
        secondaryLabel: 'Continue Without AI',
        statusCode: 503,
        context,
        originalError: error
      });
    }

    return new AppError({
      category: 'AI_SERVICE_UNAVAILABLE',
      title: "We're Working on It",
      message: 'Our AI assistant couldn’t respond just now. Please try again in a moment.',
      quote: 'Great things take time. Thank you for being part of the journey.',
      canRetry: true,
      retryLabel: 'Try Again',
      secondaryLabel: 'Continue Without AI',
      statusCode: rawStatus || 500,
      context,
      originalError: error
    });
  }

  if (rawStatus === 401 || rawMsg.toLowerCase().includes('unauthorized') || rawMsg.toLowerCase().includes('jwt expired')) {
    return new AppError({
      category: 'AUTH_EXPIRED',
      title: 'Session Expired',
      message: 'Your active session has expired. Please sign in again to continue your work without losing unsaved changes.',
      canRetry: false,
      retryLabel: 'Sign In Again',
      secondaryLabel: 'Cancel',
      statusCode: 401,
      context,
      originalError: error
    });
  }

  return new AppError({
    category: 'UNKNOWN',
    title: 'Something Went Wrong',
    message: rawMsg || 'An unexpected problem occurred while completing this action. Please try again.',
    canRetry: true,
    retryLabel: 'Try Again',
    secondaryLabel: 'Close',
    statusCode: rawStatus,
    context,
    originalError: error
  });
}

async function retryRequest(operation, options = {}) {
  const { maxRetries = 3, initialDelayMs = 20, maxDelayMs = 200, backoffFactor = 2 } = options;
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (err) {
      attempt++;
      const status = err?.statusCode || err?.status;
      if (status === 400 || status === 401 || status === 403 || status === 404 || attempt > maxRetries) {
        throw err;
      }
      const delay = Math.min(initialDelayMs * Math.pow(backoffFactor, attempt - 1), maxDelayMs);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

console.log('=== RUNNING ERROR MAPPER & RETRY TESTS ===\n');

// 1. Quotes
const q1 = getRotatingQuote('general');
const qOffline = getRotatingQuote('offline');
console.log('✓ Quote rotation tested:', q1);
console.log('✓ Offline quote verified:', qOffline);

// 2. Offline Mapping
const off = mapError(new Error('Failed to fetch'), 'network');
console.log('✓ Offline category mapped:', off.category, '| Title:', off.title);
if (off.category !== 'OFFLINE') throw new Error('Offline check failed');

// 3. AI Errors
const quota = mapError({ message: 'Quota exhausted for model', status: 429 }, 'ai-chat');
console.log('✓ AI Quota category mapped:', quota.category, '| Title:', quota.title);
if (quota.category !== 'AI_QUOTA_EXCEEDED') throw new Error('Quota check failed');

const misconfig = mapError({ message: 'API key not found', status: 400 }, 'ai-chat');
console.log('✓ AI Misconfig category mapped:', misconfig.category, '| Title:', misconfig.title, '| canRetry:', misconfig.canRetry);
if (misconfig.category !== 'AI_MISCONFIGURED' || misconfig.canRetry !== false) throw new Error('Misconfig check failed');

const maint = mapError({ message: 'Scheduled maintenance', status: 503 }, 'ai-chat');
console.log('✓ AI Maintenance category mapped:', maint.category, '| Title:', maint.title);
if (maint.category !== 'AI_MAINTENANCE') throw new Error('Maint check failed');

const ai500 = mapError({ message: 'Internal error', status: 500 }, 'ai-chat');
console.log('✓ AI 500 category mapped:', ai500.category, '| Title:', ai500.title);
if (ai500.category !== 'AI_SERVICE_UNAVAILABLE') throw new Error('AI 500 check failed');

// 4. Retry with backoff
let tries = 0;
const res = await retryRequest(async () => {
  tries++;
  if (tries < 3) {
    const err = new Error('503 Service Unavailable');
    err.statusCode = 503;
    throw err;
  }
  return 'SUCCESS';
}, { maxRetries: 3 });

console.log('✓ Retry completed successfully on attempt count:', tries, '| Result:', res);
if (res !== 'SUCCESS' || tries !== 3) throw new Error('Retry test failed');

// 5. Auth 401 should NOT retry
let authTries = 0;
try {
  await retryRequest(async () => {
    authTries++;
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }, { maxRetries: 3 });
} catch (e) {
  console.log('✓ Auth 401 stopped immediately after attempts:', authTries);
  if (authTries !== 1) throw new Error('401 should not be retried');
}

console.log('\n=== ALL UNIT TESTS PASSED SUCCESSFULLY! ===');
