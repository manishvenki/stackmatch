import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'highlight';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  const variantStyles = {
    neutral: 'bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]',
    success: 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]',
    warning: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]',
    info: 'bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]',
    highlight: 'bg-[#111827] text-white border border-[#111827]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium tracking-tight ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
