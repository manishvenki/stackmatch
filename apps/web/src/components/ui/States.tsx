import React from 'react';
import { AlertCircle, FolderPlus, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No projects yet',
  description = 'Start with an idea and StackMatch will help you plan it.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-xl border border-dashed border-[#D1D5DB] my-4">
      <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#687280] mb-3">
        {icon || <FolderPlus className="w-6 h-6 stroke-[1.5]" />}
      </div>
      <h4 className="text-base font-semibold text-[#111827] mb-1">{title}</h4>
      <p className="text-sm text-[#687280] max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We could not load this information. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-[#FEF2F2] rounded-xl border border-[#FECACA] my-4">
      <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] mb-3">
        <AlertCircle className="w-5 h-5 stroke-[2]" />
      </div>
      <h4 className="text-sm font-semibold text-[#991B1B] mb-1">{title}</h4>
      <p className="text-xs text-[#B91C1C] max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-[#E5E7EB] rounded-md ${className}`} />;
};

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-8 h-8 border-2 border-[#111827] border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-xs font-medium text-[#687280]">{message}</p>
    </div>
  );
};
