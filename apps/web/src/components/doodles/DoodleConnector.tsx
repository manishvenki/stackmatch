import React from 'react';

export interface DoodleConnectorProps {
  type?: 'curved-arrow' | 'step-arrow' | 'loop' | 'bracket';
  className?: string;
  color?: string;
}

export const DoodleConnector: React.FC<DoodleConnectorProps> = ({
  type = 'curved-arrow',
  className = '',
  color = '#9CA3AF',
}) => {
  if (type === 'step-arrow') {
    return (
      <svg
        width="64"
        height="24"
        viewBox="0 0 64 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`overflow-visible ${className}`}
        aria-hidden="true"
      >
        <path
          d="M2 12C18 12 32 6 60 12"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="4 3"
          strokeLinecap="round"
          className="animate-doodle-flow"
        />
        <path
          d="M52 6L61 12L53 18"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'loop') {
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`overflow-visible ${className}`}
        aria-hidden="true"
      >
        <path
          d="M10 24C10 16 16 10 24 10C32 10 38 16 38 24C38 32 30 38 22 38C14 38 10 32 12 26"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 3"
          className="animate-doodle-flow"
        />
        <path
          d="M8 28L12 24L16 28"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'bracket') {
    return (
      <svg
        width="28"
        height="40"
        viewBox="0 0 28 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`overflow-visible ${className}`}
        aria-hidden="true"
      >
        <path
          d="M20 4H10C6.5 4 4 6.5 4 10V18C4 19.5 2 20 2 20C2 20 4 20.5 4 22V30C4 33.5 6.5 36 10 36H20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Default: curved-arrow
  return (
    <svg
      width="80"
      height="40"
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
      aria-hidden="true"
    >
      <path
        d="M4 32C22 8 50 6 74 24"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 4"
        className="animate-doodle-flow"
      />
      <path
        d="M64 26L74 24L72 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
