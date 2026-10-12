import { getRotatingQuote } from '../utils/quotes';

export type ErrorCategory =
  | 'OFFLINE'
  | 'NETWORK_TIMEOUT'
  | 'AUTH_USER_NOT_FOUND'
  | 'AUTH_INVALID_PASSWORD'
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_EMAIL_EXISTS'
  | 'AUTH_EXPIRED'
  | 'UNAUTHORIZED'
  | 'AI_SERVICE_UNAVAILABLE'
  | 'AI_QUOTA_EXCEEDED'
  | 'AI_MISCONFIGURED'
  | 'AI_MAINTENANCE'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'EXPORT_ERROR'
  | 'UNKNOWN';

export interface AppErrorOptions {
  category: ErrorCategory;
  title: string;
  message: string;
  quote?: string;
  statusCode?: number;
  canRetry?: boolean;
  retryLabel?: string;
  secondaryLabel?: string;
  context?: string;
  originalError?: any;
}

export class AppError extends Error {
  public readonly category: ErrorCategory;
  public readonly title: string;
  public readonly quote: string;
  public readonly statusCode?: number;
  public readonly canRetry: boolean;
  public readonly retryLabel: string;
  public readonly secondaryLabel: string;
  public readonly context?: string;
  public readonly originalError?: any;

  constructor(options: AppErrorOptions) {
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

    // Assign appropriate encouraging quote
    if (options.quote) {
      this.quote = options.quote;
    } else if (this.category === 'OFFLINE') {
      this.quote = getRotatingQuote('offline');
    } else if (this.category.startsWith('AI_')) {
      this.quote = getRotatingQuote('ai');
    } else {
      this.quote = getRotatingQuote('general');
    }

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Maps any raw exception, HTTP status, or backend error payload to a strongly typed,
 * domain-separated AppError.
 */
export function mapError(error: unknown, context?: string): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const isNavigatorOffline = typeof navigator !== 'undefined' && !navigator.onLine;
  const rawMsg = (error as any)?.message || String(error || '');
  const rawStatus = (error as any)?.statusCode || (error as any)?.status;
  const rawCode = (error as any)?.code || (error as any)?.data?.code;

  // 1. Genuine Offline & Network connection failures
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
      message: "It looks like your internet connection has been interrupted. Check your network connection and try again.",
      quote: "Every great idea deserves another attempt.",
      canRetry: true,
      retryLabel: 'Retry Connection',
      secondaryLabel: 'Close',
      statusCode: rawStatus,
      context,
      originalError: error,
    });
  }

  // 2. Network Timeout
  if (
    rawMsg.includes('timed out') ||
    rawMsg.includes('AbortError') ||
    rawMsg.includes('timeout') ||
    rawStatus === 408 ||
    rawStatus === 504
  ) {
    return new AppError({
      category: 'NETWORK_TIMEOUT',
      title: 'Connection Timed Out',
      message: 'The server took longer than expected to respond. Please check your connection and try again.',
      canRetry: true,
      retryLabel: 'Try Again',
      secondaryLabel: 'Close',
      statusCode: rawStatus || 408,
      context,
      originalError: error,
    });
  }

  // 3. Authentication & Account Domain
  const isAuthContext =
    context === 'auth' ||
    context === 'auth-login' ||
    context === 'auth-register' ||
    context === 'auth-session' ||
    context === 'login' ||
    context === 'register' ||
    (Boolean(context) && context!.startsWith('/auth'));

  if (isAuthContext) {
    // 3a. Account Not Found
    if (
      rawCode === 'USER_NOT_FOUND' ||
      (rawStatus === 404 && (context === 'auth-login' || context === 'login' || context === '/auth/login')) ||
      rawMsg.toLowerCase().includes('no account was found')
    ) {
      return new AppError({
        category: 'AUTH_USER_NOT_FOUND',
        title: 'Account Not Found',
        message: 'No account was found for this email. Please sign up first.',
        canRetry: false,
        retryLabel: 'Try Again',
        secondaryLabel: 'Create Account',
        statusCode: 404,
        context,
        originalError: error,
      });
    }

    // 3b. Incorrect Password
    if (
      rawCode === 'INVALID_PASSWORD' ||
      rawMsg.toLowerCase().includes('incorrect password')
    ) {
      return new AppError({
        category: 'AUTH_INVALID_PASSWORD',
        title: 'Incorrect Password',
        message: 'The password you entered is incorrect. Please verify your credentials and try again.',
        canRetry: true,
        retryLabel: 'Try Again',
        secondaryLabel: 'Close',
        statusCode: 401,
        context,
        originalError: error,
      });
    }

    // 3c. Duplicate Email on Registration
    if (
      rawCode === 'EMAIL_ALREADY_EXISTS' ||
      rawStatus === 409 ||
      rawMsg.toLowerCase().includes('already exists')
    ) {
      return new AppError({
        category: 'AUTH_EMAIL_EXISTS',
        title: 'Account Already Exists',
        message: 'An account with this email address already exists. Please sign in instead.',
        canRetry: false,
        retryLabel: 'Sign In',
        secondaryLabel: 'Close',
        statusCode: 409,
        context,
        originalError: error,
      });
    }

    // 3d. Session Check Expired (only on protected session check endpoint)
    if (context === 'auth-session' && rawStatus === 401) {
      return new AppError({
        category: 'AUTH_EXPIRED',
        title: 'Session Expired',
        message: 'Your active session has expired. Please sign in again to continue your work.',
        canRetry: false,
        retryLabel: 'Sign In Again',
        secondaryLabel: 'Close',
        statusCode: 401,
        context,
        originalError: error,
      });
    }

    // 3e. Authentication Credentials Failure (401)
    if (rawStatus === 401) {
      return new AppError({
        category: 'AUTH_INVALID_CREDENTIALS',
        title: 'Authentication Failed',
        message: rawMsg || 'Invalid email or password. Please verify your credentials.',
        canRetry: true,
        retryLabel: 'Try Again',
        secondaryLabel: 'Close',
        statusCode: 401,
        context,
        originalError: error,
      });
    }

    // 3f. Form Validation Errors (400)
    if (
      rawStatus === 400 ||
      rawCode === 'VALIDATION_ERROR' ||
      /\b(enter a valid email|passwords do not match|password must be|required)\b/i.test(rawMsg)
    ) {
      return new AppError({
        category: 'VALIDATION_ERROR',
        title: 'Invalid Details',
        message: rawMsg || 'Please review your input and ensure all required fields are filled correctly.',
        canRetry: true,
        retryLabel: 'Review Input',
        secondaryLabel: 'Close',
        statusCode: 400,
        context,
        originalError: error,
      });
    }

    // 3g. Rate limiting on auth
    if (rawStatus === 429) {
      return new AppError({
        category: 'RATE_LIMITED',
        title: 'Too Many Attempts',
        message: 'Too many authentication attempts. Please pause for a moment before retrying.',
        canRetry: true,
        retryLabel: 'Try Again',
        secondaryLabel: 'Close',
        statusCode: 429,
        context,
        originalError: error,
      });
    }

    // 3h. Server 500 on auth
    if (rawStatus && rawStatus >= 500) {
      return new AppError({
        category: 'SERVER_ERROR',
        title: 'Sign In Temporarily Unavailable',
        message: 'The authentication server encountered an unexpected error. Please try again shortly.',
        canRetry: true,
        retryLabel: 'Try Again',
        secondaryLabel: 'Close',
        statusCode: rawStatus,
        context,
        originalError: error,
      });
    }
  }

  // 4. Isolated AI Domain (Strictly for AI features or explicit AI provider messages)
  const isAiContext =
    context === 'ai-chat' ||
    context === 'ai-planning' ||
    context === 'ai-analysis' ||
    (Boolean(context) && context!.startsWith('ai'));

  const hasExplicitAiKeyword =
    /\b(gemini|gpt|claude|openai|anthropic|llm|token quota|token limit|model not found)\b/i.test(rawMsg);

  if ((isAiContext || hasExplicitAiKeyword) && !isAuthContext) {
    // Quota exhausted
    if (rawStatus === 429 || rawMsg.toLowerCase().includes('quota') || rawMsg.toLowerCase().includes('limit reached')) {
      return new AppError({
        category: 'AI_QUOTA_EXCEEDED',
        title: 'AI Usage Limit Reached',
        message: 'The AI service has reached its current usage limit. Please try again in a moment.',
        quote: 'Great things take time. Thank you for being part of the journey.',
        canRetry: true,
        retryLabel: 'Try Again',
        secondaryLabel: 'Continue Without AI',
        statusCode: 429,
        context,
        originalError: error,
      });
    }

    // Invalid Configuration / Model 404 / API Key
    if (
      rawStatus === 400 ||
      rawStatus === 403 ||
      (rawStatus === 404 && rawMsg.toLowerCase().includes('model')) ||
      rawMsg.toLowerCase().includes('api key') ||
      rawMsg.toLowerCase().includes('credentials')
    ) {
      return new AppError({
        category: 'AI_MISCONFIGURED',
        title: 'AI Service Misconfigured',
        message: 'The AI service configuration is incomplete or unavailable. Please try again later.',
        quote: 'A small setback is not the end of the journey.',
        canRetry: false,
        retryLabel: 'Try Again',
        secondaryLabel: 'Continue Without AI',
        statusCode: rawStatus || 400,
        context,
        originalError: error,
      });
    }

    // Maintenance state
    if (rawStatus === 503 && rawMsg.toLowerCase().includes('maintenance')) {
      return new AppError({
        category: 'AI_MAINTENANCE',
        title: 'Feature Under Maintenance',
        message: 'AI planning is temporarily unavailable while improvements are underway. Thank you for your patience.',
        quote: 'Good things are worth building carefully.',
        canRetry: true,
        retryLabel: 'Try Again',
        secondaryLabel: 'Continue Without AI',
        statusCode: 503,
        context,
        originalError: error,
      });
    }

    // General AI feature unavailability
    return new AppError({
      category: 'AI_SERVICE_UNAVAILABLE',
      title: 'AI Temporarily Unavailable',
      message: 'AI recommendations are temporarily unavailable. Please try again in a moment.',
      quote: 'Great things take time. Thank you for being part of the journey.',
      canRetry: true,
      retryLabel: 'Try Again',
      secondaryLabel: 'Continue Without AI',
      statusCode: rawStatus || 500,
      context,
      originalError: error,
    });
  }

  // 5. Session Expiration on Protected App Routes (e.g. GET /projects, GET /auth/me)
  if (rawStatus === 401 || rawMsg.toLowerCase().includes('jwt expired') || rawMsg.toLowerCase().includes('unauthorized')) {
    return new AppError({
      category: 'AUTH_EXPIRED',
      title: 'Session Expired',
      message: 'Your active session has expired. Please sign in again to continue your work without losing unsaved changes.',
      canRetry: false,
      retryLabel: 'Sign In Again',
      secondaryLabel: 'Cancel',
      statusCode: 401,
      context,
      originalError: error,
    });
  }

  // 6. Access Forbidden (403)
  if (rawStatus === 403) {
    return new AppError({
      category: 'UNAUTHORIZED',
      title: 'Access Restricted',
      message: 'You do not have permission to access or modify this resource.',
      canRetry: false,
      retryLabel: 'Go to Dashboard',
      secondaryLabel: 'Close',
      statusCode: 403,
      context,
      originalError: error,
    });
  }

  // 7. Resource Not Found (404)
  if (rawStatus === 404) {
    return new AppError({
      category: 'NOT_FOUND',
      title: 'Resource Not Found',
      message: 'The requested project or resource could not be found. It may have been moved or deleted.',
      canRetry: false,
      retryLabel: 'Back to Dashboard',
      secondaryLabel: 'Close',
      statusCode: 404,
      context,
      originalError: error,
    });
  }

  // 8. General Rate Limiting (429)
  if (rawStatus === 429) {
    return new AppError({
      category: 'RATE_LIMITED',
      title: 'Too Many Requests',
      message: 'You are making requests too quickly. Please pause for a moment before retrying.',
      canRetry: true,
      retryLabel: 'Try Again',
      secondaryLabel: 'Close',
      statusCode: 429,
      context,
      originalError: error,
    });
  }

  // 9. PDF Export & Download Errors
  if (context === 'pdf-export' || /\b(pdf|export)\b/i.test(rawMsg)) {
    return new AppError({
      category: 'EXPORT_ERROR',
      title: 'Blueprint Export Error',
      message: 'We were unable to render the multi-page PDF document. Your project data is completely safe.',
      canRetry: true,
      retryLabel: 'Retry PDF Export',
      secondaryLabel: 'Keep Blueprint Visible',
      context,
      originalError: error,
    });
  }

  // 10. General Validation Error (422 or 400)
  if (rawStatus === 422 || rawStatus === 400) {
    return new AppError({
      category: 'VALIDATION_ERROR',
      title: 'Invalid Request',
      message: rawMsg || 'The request was invalid. Please check your data and try again.',
      canRetry: true,
      retryLabel: 'Try Again',
      secondaryLabel: 'Close',
      statusCode: rawStatus,
      context,
      originalError: error,
    });
  }

  // 11. Backend Server 500+ Error
  if (rawStatus && rawStatus >= 500) {
    return new AppError({
      category: 'SERVER_ERROR',
      title: 'Temporary Server Issue',
      message: 'Our service encountered an unexpected issue while processing your request. Please try again shortly.',
      canRetry: true,
      retryLabel: 'Try Again',
      secondaryLabel: 'Close',
      statusCode: rawStatus,
      context,
      originalError: error,
    });
  }

  // 12. Default Fallback
  return new AppError({
    category: 'UNKNOWN',
    title: 'Something Went Wrong',
    message: rawMsg || 'An unexpected problem occurred while completing this action. Please try again.',
    canRetry: true,
    retryLabel: 'Try Again',
    secondaryLabel: 'Close',
    statusCode: rawStatus,
    context,
    originalError: error,
  });
}
