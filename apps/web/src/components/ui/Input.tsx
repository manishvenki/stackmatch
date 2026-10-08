import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#374151] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[#9CA3AF] pointer-events-none inline-flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white border rounded-lg text-sm text-[#111827] placeholder-[#9CA3AF] transition-subtle focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF] ${
              leftIcon ? 'pl-9' : 'pl-3.5'
            } ${rightIcon ? 'pr-9' : 'pr-3.5'} py-2 ${
              error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#D1D5DB]'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[#9CA3AF] pointer-events-none inline-flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-[#DC2626]">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-[#687280]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium text-[#374151] mb-1.5">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`w-full bg-white border rounded-lg text-sm text-[#111827] placeholder-[#9CA3AF] transition-subtle focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent p-3 disabled:bg-[#F9FAFB] ${
            error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#D1D5DB]'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-[#DC2626]">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-[#687280]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
