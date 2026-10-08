import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  selected?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  selected = false,
  padded = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border transition-subtle ${
        selected
          ? 'border-[#111827] ring-1 ring-[#111827] shadow-sm'
          : 'border-[#E5E7EB] shadow-subtle'
      } ${
        hoverable ? 'hover:border-[#D1D5DB] hover:shadow-card cursor-pointer' : ''
      } ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
