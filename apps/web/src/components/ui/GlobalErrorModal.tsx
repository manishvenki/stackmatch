import React, { useEffect, useRef } from 'react';
import { 
  WifiOff, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  FileWarning, 
  RefreshCw, 
  X, 
  HelpCircle,
  Quote
} from 'lucide-react';
import { useErrorHandler } from '../../context/GlobalErrorContext';
import { Button } from './Button';
import { DoodleSpark } from '../doodles/DoodleSpark';

export const GlobalErrorModal: React.FC = () => {
  const { currentError, isModalOpen, isRetrying, hideErrorModal, handleRetry, handleSecondary } = useErrorHandler();
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap & Escape key listener
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isRetrying) {
        // Only allow escape if the error is dismissable safely
        if (currentError?.category !== 'AUTH_EXPIRED') {
          hideErrorModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Auto-focus primary retry button
    const timer = setTimeout(() => {
      primaryButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isModalOpen, isRetrying, currentError, hideErrorModal]);

  if (!isModalOpen || !currentError) return null;

  // Render contextual icon
  const renderCategoryIcon = () => {
    switch (currentError.category) {
      case 'OFFLINE':
      case 'NETWORK_TIMEOUT':
        return (
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] shadow-2xs">
            <WifiOff className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
      case 'AI_SERVICE_UNAVAILABLE':
      case 'AI_QUOTA_EXCEEDED':
      case 'AI_MISCONFIGURED':
      case 'AI_MAINTENANCE':
        return (
          <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] shadow-2xs relative">
            <Sparkles className="w-6 h-6 stroke-[2.2]" />
            <div className="absolute -top-1 -right-1">
              <DoodleSpark size={14} color="#2563EB" />
            </div>
          </div>
        );
      case 'AUTH_EXPIRED':
      case 'AUTH_USER_NOT_FOUND':
      case 'AUTH_INVALID_PASSWORD':
      case 'AUTH_INVALID_CREDENTIALS':
      case 'AUTH_EMAIL_EXISTS':
      case 'UNAUTHORIZED':
        return (
          <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#DC2626] shadow-2xs">
            <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
      case 'EXPORT_ERROR':
        return (
          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shadow-2xs">
            <FileWarning className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#374151] shadow-2xs">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-error-title"
      aria-describedby="global-error-desc"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isRetrying && currentError.category !== 'AUTH_EXPIRED') {
          hideErrorModal();
        }
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-2xl border border-[#D1D5DB] shadow-2xl p-6 sm:p-7 relative overflow-hidden transition-all"
      >
        {/* Close Button (if safe to dismiss) */}
        {currentError.category !== 'AUTH_EXPIRED' && (
          <button
            type="button"
            onClick={hideErrorModal}
            disabled={isRetrying}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors disabled:opacity-40"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header with Icon and Title */}
        <div className="flex items-start gap-4 mb-4">
          {renderCategoryIcon()}
          <div className="pt-0.5 pr-6">
            <h2
              id="global-error-title"
              className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight"
            >
              {currentError.title}
            </h2>
            <p
              id="global-error-desc"
              className="text-xs sm:text-sm text-[#4B5563] mt-1.5 leading-relaxed"
            >
              {currentError.message}
            </p>
          </div>
        </div>

        {/* Encouraging Quote Box */}
        {currentError.quote && (
          <div className="mt-4 mb-5 p-3.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-start gap-3">
            <Quote className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5 opacity-80" />
            <p className="text-xs text-[#374151] font-medium italic leading-relaxed">
              “{currentError.quote}”
            </p>
          </div>
        )}

        {/* Contextual Guidance / Troubleshooting Tips */}
        {currentError.category === 'OFFLINE' && (
          <div className="mb-5 p-3 bg-[#EFF6FF]/60 rounded-xl border border-[#DBEAFE] text-[11px] text-[#1E40AF] flex items-start gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Tip: Check your Wi-Fi or mobile data connection. Once reconnected, clicking <strong>Retry Connection</strong> will safely resume your current request.
            </span>
          </div>
        )}

        {currentError.category === 'AI_QUOTA_EXCEEDED' && (
          <div className="mb-5 p-3 bg-[#FEF3C7]/60 rounded-xl border border-[#FDE68A] text-[11px] text-[#92400E] flex items-start gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              You can still edit requirements, view the technology stack, and export your roadmap manually without waiting for AI quota reset.
            </span>
          </div>
        )}

        {/* Modal Action Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-[#F3F4F6]">
          {currentError.secondaryLabel && (
            <Button
              variant="outline"
              size="md"
              onClick={handleSecondary}
              disabled={isRetrying}
              className="w-full sm:w-auto text-xs font-semibold"
            >
              {currentError.secondaryLabel}
            </Button>
          )}

          {currentError.canRetry && (
            <Button
              ref={primaryButtonRef}
              variant="primary"
              size="md"
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full sm:w-auto text-xs font-bold shadow-xs hover:shadow-sm"
              leftIcon={
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`}
                />
              }
            >
              {isRetrying ? 'Retrying...' : currentError.retryLabel}
            </Button>
          )}

          {!currentError.canRetry && currentError.category === 'AUTH_EXPIRED' && (
            <Button
              ref={primaryButtonRef}
              variant="primary"
              size="md"
              onClick={() => {
                hideErrorModal();
                window.location.reload();
              }}
              className="w-full sm:w-auto text-xs font-bold"
            >
              Sign In Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
