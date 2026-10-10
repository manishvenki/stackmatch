/**
 * StackMatch Retry Utility
 * Handles bounded retries with exponential backoff and jitter for transient operations.
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  shouldRetry?: (error: any, attempt: number) => boolean;
}

export async function retryRequest<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 500,
    maxDelayMs = 4000,
    backoffFactor = 2,
    shouldRetry = defaultShouldRetry,
  } = options;

  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (err: any) {
      attempt++;

      if (attempt > maxRetries || !shouldRetry(err, attempt)) {
        throw err;
      }

      // Calculate exponential backoff with random jitter
      const exponentialDelay = initialDelayMs * Math.pow(backoffFactor, attempt - 1);
      const jitter = Math.random() * 200;
      const delay = Math.min(exponentialDelay + jitter, maxDelayMs);

      console.warn(`[RetryRequest] Transient failure on attempt ${attempt}/${maxRetries}. Retrying in ${Math.round(delay)}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Determines whether an error is transient and safe to retry automatically.
 * Avoids retrying 400 (Bad Request), 401 (Auth Expired), 403 (Forbidden), 404 (Not Found),
 * or non-transient configuration errors.
 */
function defaultShouldRetry(error: any): boolean {
  const status = error?.statusCode || error?.status;
  if (status === 400 || status === 401 || status === 403 || status === 404) {
    return false;
  }

  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('invalid credentials') || msg.includes('unauthorized')) {
    return false;
  }

  // Network failures, 502, 503, 504, 408 are transient
  if (
    status === 502 ||
    status === 503 ||
    status === 504 ||
    status === 408 ||
    msg.includes('timed out') ||
    msg.includes('failed to fetch') ||
    msg.includes('network')
  ) {
    return true;
  }

  return false;
}
