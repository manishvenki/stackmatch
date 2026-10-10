import React from 'react';

export interface DoodleSparkProps {
  size?: number;
  className?: string;
  color?: string;
}

export const DoodleSpark: React.FC<DoodleSparkProps> = ({
  size = 24,
  className = '',
  color = '#2563EB',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible animate-doodle-pulse ${className}`}
      aria-hidden="true"
    >
      {/* 4-point hand-drawn star burst */}
      <path
        d="M16 2C16.8 9.5 22.5 15.2 30 16C22.5 16.8 16.8 22.5 16 30C15.2 22.5 9.5 16.8 2 16C9.5 15.2 15.2 9.5 16 2Z"
        fill={color}
        fillOpacity="0.12"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hand-drawn accent dots */}
      <circle cx="27" cy="5" r="1.25" fill={color} />
      <circle cx="5" cy="27" r="1" fill={color} />
      <circle cx="28" cy="26" r="1.5" fill={color} />
      <circle cx="4" cy="6" r="1.25" fill={color} />
    </svg>
  );
};
