import React from 'react';

export interface DoodleUnderlineProps {
  className?: string;
  color?: string;
}

export const DoodleUnderline: React.FC<DoodleUnderlineProps> = ({
  className = '',
  color = '#2563EB',
}) => {
  return (
    <svg
      viewBox="0 0 240 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full overflow-visible ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2 3C48 7.5 132 8.5 238 3.5C182 8 98 9.5 26 8.5"
        stroke={color}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-doodle-draw"
      />
    </svg>
  );
};
