import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AppError, mapError } from '../services/errorMapper';

export interface ShowErrorOptions {
  onRetry?: () => Promise<void> | void;
  onSecondary?: () => void;
  context?: string;
  quote?: string;
}

export interface GlobalErrorContextType {
  currentError: AppError | null;
  isRetrying: boolean;
  isModalOpen: boolean;
  showErrorModal: (error: unknown, options?: ShowErrorOptions) => void;
  hideErrorModal: () => void;
  handleRetry: () => Promise<void>;
  handleSecondary: () => void;
  reportError: (error: unknown, context?: string) => AppError;
}

const GlobalErrorContext = createContext<GlobalErrorContextType>({
  currentError: null,
  isRetrying: false,
  isModalOpen: false,
  showErrorModal: () => {},
  hideErrorModal: () => {},
  handleRetry: async () => {},
  handleSecondary: () => {},
  reportError: (err) => mapError(err),
});

export const GlobalErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentError, setCurrentError] = useState<AppError | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Store the active retry / secondary callbacks in refs so they survive rerenders
  const retryCallbackRef = useRef<(() => Promise<void> | void) | null>(null);
  const secondaryCallbackRef = useRef<(() => void) | null>(null);

  const reportError = useCallback((error: unknown, context?: string): AppError => {
    const appErr = mapError(error, context);
    console.error(`[GlobalErrorHandler] [${context || 'General'}]`, appErr.title, '-', appErr.message);
    return appErr;
  }, []);

  const showErrorModal = useCallback(
    (error: unknown, options?: ShowErrorOptions) => {
      const appErr = mapError(error, options?.context);
      retryCallbackRef.current = options?.onRetry || null;
      secondaryCallbackRef.current = options?.onSecondary || null;

      setCurrentError(appErr);
      setIsModalOpen(true);
      setIsRetrying(false);
    },
    []
  );

  const hideErrorModal = useCallback(() => {
    if (isRetrying) return; // Prevent closing while an active retry operation is resolving
    setIsModalOpen(false);
    setCurrentError(null);
    retryCallbackRef.current = null;
    secondaryCallbackRef.current = null;
  }, [isRetrying]);

  const handleRetry = useCallback(async () => {
    if (!retryCallbackRef.current || isRetrying) return;

    try {
      setIsRetrying(true);
      await retryCallbackRef.current();
      // If retry succeeds cleanly without throwing, close modal
      setIsModalOpen(false);
      setCurrentError(null);
      retryCallbackRef.current = null;
      secondaryCallbackRef.current = null;
    } catch (newError: any) {
      console.warn('[GlobalErrorHandler] Retry attempt failed:', newError?.message);
      // Update error state while maintaining modal open
      const refreshedErr = mapError(newError, currentError?.context);
      setCurrentError(refreshedErr);
    } finally {
      setIsRetrying(false);
    }
  }, [isRetrying, currentError]);

  const handleSecondary = useCallback(() => {
    if (secondaryCallbackRef.current) {
      try {
        secondaryCallbackRef.current();
      } catch (e) {
        console.warn('[GlobalErrorHandler] Secondary callback threw:', e);
      }
    }
    hideErrorModal();
  }, [hideErrorModal]);

  return (
    <GlobalErrorContext.Provider
      value={{
        currentError,
        isRetrying,
        isModalOpen,
        showErrorModal,
        hideErrorModal,
        handleRetry,
        handleSecondary,
        reportError,
      }}
    >
      {children}
    </GlobalErrorContext.Provider>
  );
};

export const useErrorHandler = () => useContext(GlobalErrorContext);
