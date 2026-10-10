import React from 'react';

export interface StackMatchLogoProps {
  variant?: 'full' | 'mark' | 'compact';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const StackMatchLogo: React.FC<StackMatchLogoProps> = ({
  variant = 'full',
  theme = 'light',
  size = 'md',
  className = '',
}) => {
  const isDark = theme === 'dark';

  const sizeDimensions = {
    sm: { icon: 22, text: 'text-sm', badge: 'w-6 h-6' },
    md: { icon: 28, text: 'text-base', badge: 'w-7 h-7' },
    lg: { icon: 36, text: 'text-xl', badge: 'w-9 h-9' },
    xl: { icon: 48, text: 'text-2xl', badge: 'w-12 h-12' },
  }[size];

  // Precision vector geometric mark: Connected architectural nodes forming a dynamic geometric "S"
  const markSvg = (
    <svg
      width={sizeDimensions.icon}
      height={sizeDimensions.icon}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-label="StackMatch Logo Mark"
    >
      {/* Background container with rounded geometry */}
      <rect
        width="32"
        height="32"
        rx="8"
        fill={isDark ? '#FFFFFF' : '#111827'}
      />
      {/* Upper idea node & bracket */}
      <path
        d="M22 10.5H13C11.3431 10.5 10 11.8431 10 13.5C10 15.1569 11.3431 16.5 13 16.5H19C20.6569 16.5 22 17.8431 22 19.5C22 21.1569 20.6569 22.5 19 22.5H10"
        stroke={isDark ? '#111827' : '#FFFFFF'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Connection nexus node */}
      <circle
        cx="19"
        cy="10.5"
        r="1.75"
        fill="#2563EB"
      />
      {/* Blueprint anchor node */}
      <circle
        cx="13"
        cy="22.5"
        r="1.75"
        fill="#2563EB"
      />
      {/* Center matching nexus indicator */}
      <circle
        cx="16"
        cy="16.5"
        r="1.25"
        fill={isDark ? '#111827' : '#FFFFFF'}
      />
    </svg>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center ${className}`}>{markSvg}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {markSvg}
      <div className="flex flex-col leading-none">
        <span
          className={`font-black tracking-tight ${sizeDimensions.text} ${
            isDark ? 'text-white' : 'text-[#111827]'
          }`}
        >
          Stack<span className="text-[#2563EB]">Match</span>
        </span>
        {variant === 'full' && (
          <span
            className={`text-[9px] font-semibold tracking-wider uppercase mt-0.5 ${
              isDark ? 'text-[#9CA3AF]' : 'text-[#687280]'
            }`}
          >
            Planning Studio
          </span>
        )}
      </div>
    </div>
  );
};

export default StackMatchLogo;
