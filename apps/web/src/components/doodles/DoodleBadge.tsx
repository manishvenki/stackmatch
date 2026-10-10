import React from 'react';

export interface DoodleBadgeProps {
  className?: string;
  color?: string;
}

export const DoodleBadge: React.FC<DoodleBadgeProps> = ({
  className = '',
  color = '#2563EB',
}) => {
  return (
    <svg
      viewBox="0 0 60 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <path
        d="M28 3.5C44 2.5 56 9 57 18C58 27 46 32.5 30 33C14 33.5 3 28.5 2.5 19C2 9.5 12 3 26 3.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-doodle-draw"
      />
    </svg>
  );
};
