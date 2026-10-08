import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'ghost',
  size = 'md',
  ariaLabel,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'p-1.5 rounded-md text-xs',
    md: 'p-2 rounded-lg text-sm',
    lg: 'p-2.5 rounded-lg text-base',
  };

  const variantStyles = {
    primary: 'bg-[#111827] text-white hover:bg-[#1f2937]',
    secondary: 'bg-white text-[#374151] border border-[#D1D5DB] hover:bg-[#F9FAFB]',
    ghost: 'text-[#687280] hover:text-[#111827] hover:bg-[#F3F4F6]',
    danger: 'text-[#DC2626] hover:bg-[#FEE2E2]',
  };

  return (
    <button
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center transition-subtle disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#111827] ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
