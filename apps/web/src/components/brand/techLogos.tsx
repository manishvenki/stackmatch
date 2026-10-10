import React from 'react';
import { Cpu, Database, Server, Globe, Shield, Cloud, CreditCard, Box } from 'lucide-react';

export interface TechLogoProps {
  name: string;
  className?: string;
  size?: number;
}

export const TechLogo: React.FC<TechLogoProps> = ({ name, className = '', size = 24 }) => {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. React
  if (normalized.includes('react')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="-11.5 -10.23174 23 20.46348"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="React Logo"
      >
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // 2. Node.js
  if (normalized.includes('node')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Node.js Logo"
      >
        <path
          d="M16 2.5L28 9.5V23.5L16 30.5L4 23.5V9.5L16 2.5Z"
          fill="#339933"
        />
        <path
          d="M16 7L24 11.5V20.5L16 25L8 20.5V11.5L16 7Z"
          fill="#FFFFFF"
          fillOpacity="0.25"
        />
        <path
          d="M16 11L21 14V19L16 22L11 19V14L16 11Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 3. TypeScript
  if (normalized.includes('typescript') || normalized === 'ts') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="TypeScript Logo"
      >
        <rect width="32" height="32" rx="6" fill="#3178C6" />
        <path
          d="M13 14H7V11H21V14H15V24H13V14ZM22 21.5C22.7 22.3 23.8 22.8 25.1 22.8C26.5 22.8 27.2 22.2 27.2 21.4C27.2 19.3 22.2 19.8 22.2 15.6C22.2 13.1 24.3 11.5 27 11.5C28.4 11.5 29.8 12.1 30.7 13.1L29.1 14.9C28.5 14.2 27.8 13.8 26.9 13.8C25.8 13.8 25 14.3 25 15.2C25 17.3 30.1 16.7 30.1 20.9C30.1 23.5 27.9 25 25.1 25C23.2 25 21.7 24.2 20.5 22.9L22 21.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 4. PostgreSQL
  if (normalized.includes('postgres')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="PostgreSQL Logo"
      >
        <rect width="32" height="32" rx="6" fill="#336791" />
        <path
          d="M16 6C11.5 6 8 9.5 8 14C8 17.5 10.2 20.5 13.3 21.5V26H18.7V21.5C21.8 20.5 24 17.5 24 14C24 9.5 20.5 6 16 6ZM16 9C18.8 9 21 11.2 21 14C21 16.8 18.8 19 16 19C13.2 19 11 16.8 11 14C11 11.2 13.2 9 16 9Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 5. MongoDB
  if (normalized.includes('mongo')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="MongoDB Logo"
      >
        <rect width="32" height="32" rx="6" fill="#116149" />
        <path
          d="M16 4C16 4 10 10.5 10 17C10 21.5 13 25.5 16 28C19 25.5 22 21.5 22 17C22 10.5 16 4 16 4ZM16.5 25.5V10C18.5 13 20 16 20 18C20 21.5 18.5 24 16.5 25.5Z"
          fill="#47A248"
        />
        <path
          d="M16 4V28C13 25.5 10 21.5 10 17C10 10.5 16 4 16 4Z"
          fill="#FFFFFF"
          fillOpacity="0.8"
        />
      </svg>
    );
  }

  // 6. Docker
  if (normalized.includes('docker')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Docker Logo"
      >
        <rect width="32" height="32" rx="6" fill="#2496ED" />
        <g fill="#FFFFFF">
          <rect x="7" y="14" width="3" height="3" rx="0.5" />
          <rect x="11" y="14" width="3" height="3" rx="0.5" />
          <rect x="15" y="14" width="3" height="3" rx="0.5" />
          <rect x="11" y="10" width="3" height="3" rx="0.5" />
          <rect x="15" y="10" width="3" height="3" rx="0.5" />
          <rect x="15" y="6" width="3" height="3" rx="0.5" />
          <path d="M4 18C4 18 6 24 16 24C24 24 28 19 28 18C26 18 24 19 22 18.5C21 16 19 17 19 17H4V18Z" />
        </g>
      </svg>
    );
  }

  // 7. Express
  if (normalized.includes('express')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Express.js Logo"
      >
        <rect width="32" height="32" rx="6" fill="#111827" />
        <text
          x="16"
          y="20"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="bold"
          fontSize="10"
        >
          EX
        </text>
      </svg>
    );
  }

  // 8. Python
  if (normalized.includes('python')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Python Logo"
      >
        <rect width="32" height="32" rx="6" fill="#1E293B" />
        <path
          d="M15.8 6C11.5 6 12 7.8 12 7.8V9.8H16V10.4H9.5C7.2 10.4 6 11.5 6 14.5C6 17.5 7.6 17.5 7.6 17.5H9.2V15.2C9.2 13 10.7 13 10.7 13H15.8C17.6 13 18.5 12 18.5 10.2V7.8C18.5 7.8 18.8 6 15.8 6ZM14.2 7.5C14.7 7.5 15.1 7.9 15.1 8.4C15.1 8.9 14.7 9.3 14.2 9.3C13.7 9.3 13.3 8.9 13.3 8.4C13.3 7.9 13.7 7.5 14.2 7.5Z"
          fill="#3776AB"
        />
        <path
          d="M16.2 26C20.5 26 20 24.2 20 24.2V22.2H16V21.6H22.5C24.8 21.6 26 20.5 26 17.5C26 14.5 24.4 14.5 24.4 14.5H22.8V16.8C22.8 19 21.3 19 21.3 19H16.2C14.4 19 13.5 20 13.5 21.8V24.2C13.5 24.2 13.2 26 16.2 26ZM17.8 24.5C17.3 24.5 16.9 24.1 16.9 23.6C16.9 23.1 17.3 22.7 17.8 22.7C18.3 22.7 18.7 23.1 18.7 23.6C18.7 24.1 18.3 24.5 17.8 24.5Z"
          fill="#FFD43B"
        />
      </svg>
    );
  }

  // 9. Go / Golang
  if (normalized.includes('go') || normalized.includes('golang')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Go Language Logo"
      >
        <rect width="32" height="32" rx="6" fill="#00ADD8" />
        <text
          x="16"
          y="21"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="12"
          letterSpacing="0.5"
        >
          GO
        </text>
      </svg>
    );
  }

  // 10. Redis
  if (normalized.includes('redis')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Redis Logo"
      >
        <rect width="32" height="32" rx="6" fill="#DC382D" />
        <g fill="#FFFFFF">
          <polygon points="16,8 24,12 16,16 8,12" opacity="0.9" />
          <polygon points="16,13 24,17 16,21 8,17" opacity="0.75" />
          <polygon points="16,18 24,22 16,26 8,22" opacity="0.6" />
        </g>
      </svg>
    );
  }

  // 11. Tailwind CSS
  if (normalized.includes('tailwind')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Tailwind CSS Logo"
      >
        <rect width="32" height="32" rx="6" fill="#0F172A" />
        <path
          d="M12.5 13.5C13.2 11.5 14.8 10.5 17.2 10.5C20.2 10.5 21.2 12.5 22.5 12.5C23.5 12.5 24.2 11.8 24.8 10.5C24.2 12.5 22.5 13.5 20.2 13.5C17.2 13.5 16.2 11.5 14.8 11.5C13.8 11.5 13.2 12.2 12.5 13.5ZM7.5 18.5C8.2 16.5 9.8 15.5 12.2 15.5C15.2 15.5 16.2 17.5 17.5 17.5C18.5 17.5 19.2 16.8 19.8 15.5C19.2 17.5 17.5 18.5 15.2 18.5C12.2 18.5 11.2 16.5 9.8 16.5C8.8 16.5 8.2 17.2 7.5 18.5Z"
          fill="#38BDF8"
        />
      </svg>
    );
  }

  // 12. Next.js
  if (normalized.includes('next')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Next.js Logo"
      >
        <rect width="32" height="32" rx="6" fill="#000000" />
        <path
          d="M19.5 9.5L11.5 20.5H9.5V9.5H11.5V17L18.5 7.5H20.5V22.5H18.5V11L19.5 9.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 13. Payment / Razorpay / Stripe
  if (normalized.includes('razorpay') || normalized.includes('stripe') || normalized.includes('payment')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Payment Gateway Logo"
      >
        <rect width="32" height="32" rx="6" fill="#0C2340" />
        <path
          d="M10 24L18 8H13L9 16L10 24ZM15 24L23 8H18.5L14.5 16L15 24Z"
          fill="#00B9F5"
        />
      </svg>
    );
  }

  // 14. JWT / Authentication
  if (normalized.includes('jwt') || normalized.includes('auth')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="JWT Security Logo"
      >
        <rect width="32" height="32" rx="6" fill="#D63AFF" />
        <path
          d="M16 6L24 10V16C24 21 20.5 24.5 16 26C11.5 24.5 8 21 8 16V10L16 6Z"
          fill="#FFFFFF"
        />
        <path
          d="M16 11L20.5 13.5V16.5C20.5 19.5 18.5 21.5 16 22.5C13.5 21.5 11.5 19.5 11.5 16.5V13.5L16 11Z"
          fill="#D63AFF"
        />
      </svg>
    );
  }

  // 15. Cloud / AWS
  if (normalized.includes('aws') || normalized.includes('cloud') || normalized.includes('deploy')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Cloud Architecture Logo"
      >
        <rect width="32" height="32" rx="6" fill="#232F3E" />
        <path
          d="M16 10C13.5 10 11.5 11.8 11.1 14.2C9.3 14.6 8 16.2 8 18C8 20.2 9.8 22 12 22H21C22.7 22 24 20.7 24 19C24 17.5 22.9 16.2 21.5 16C21.2 12.6 18.9 10 16 10Z"
          fill="#FF9900"
        />
      </svg>
    );
  }

  // Fallback: Elegant, accessible architectural category badge
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-md bg-[#111827] text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs ${className}`}
      title={name}
      aria-label={`${name} Logo`}
    >
      <Box className="w-3.5 h-3.5 text-white" />
    </div>
  );
};
