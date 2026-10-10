import { getRotatingQuote } from '../utils/quotes';

export type ErrorCategory =
  | 'OFFLINE'
  | 'NETWORK_TIMEOUT'
  | 'AI_SERVICE_UNAVAILABLE'
  | 'AI_QUOTA_EXCEEDED'
  | 'AI_MISCONFIGURED'
  | 'AI_MAINTENANCE'
  | 'AUTH_EXPIRED'
  | 'UNAUTHORIZED'
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
 * Maps any raw exception or HTTP error response to a user-safe AppError
 */
export function mapError(error: unknown, context?: string): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const isNavigatorOffline = typeof navigator !== 'undefined' && !navigator.onLine;
  const rawMsg = (error as any)?.message || String(error || '');
  const rawStatus = (error as any)?.statusCode || (error as any)?.status;

  // 1. Check for genuine Offline status
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

  // 2. Network Timeout
  if (
    rawMsg.includes('timed out') ||
    rawMsg.includes('AbortError') ||
    rawMsg.includes('timeout')
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
      originalError: error
    });
  }

  // 3. AI Planning / Chat Specific Errors
  if (context === 'ai-chat' || context === 'ai-planning' || rawMsg.toLowerCase().includes('gemini') || rawMsg.toLowerCase().includes('model') || rawMsg.toLowerCase().includes('ai')) {
    // Quota exhausted
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

    // Invalid Configuration / Model 404 / 400
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

    // Maintenance state
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

    // General AI unavailability
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

  // 4. Authentication Expired
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

  // 5. Unauthorized (403)
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
      originalError: error
    });
  }

  // 6. Not Found (404)
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
      originalError: error
    });
  }

  // 7. General Rate Limit (429)
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
      originalError: error
    });
  }

  // 8. PDF Export & Download Errors
  if (context === 'pdf-export' || rawMsg.toLowerCase().includes('pdf') || rawMsg.toLowerCase().includes('export')) {
    return new AppError({
      category: 'EXPORT_ERROR',
      title: 'Blueprint Export Error',
      message: 'We were unable to render the multi-page PDF document. Your project data is completely safe.',
      canRetry: true,
      retryLabel: 'Retry PDF Export',
      secondaryLabel: 'Keep Blueprint Visible',
      context,
      originalError: error
    });
  }

  // 9. Server 500+ Error
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
      originalError: error
    });
  }

  // 10. Default fallback
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
