import React, { useEffect, useState } from 'react';
import { StackMatchLogo } from '../brand/StackMatchLogo';

export interface FullScreenDoodleLoaderProps {
  isLoading: boolean;
  message?: string;
  onFinished?: () => void;
  maxTimeoutMs?: number;
}

export const FullScreenDoodleLoader: React.FC<FullScreenDoodleLoaderProps> = ({
  isLoading,
  message = 'Connecting ideas. Building your blueprint.',
  onFinished,
  maxTimeoutMs = 3500,
}) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Calibrating planning studio...',
    'Connecting ideas & requirements...',
    'Synthesizing architecture topography...',
    'Finalizing build-ready blueprint...',
  ];

  // Cycle through subtle step messages
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Watch for loading completion or max timeout fallback
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (!isLoading) {
      setIsFadingOut(true);
      const exitTimer = setTimeout(() => {
        setShouldRender(false);
        onFinished?.();
      }, 450); // Match transition duration
      return () => clearTimeout(exitTimer);
    } else {
      // Safety timeout: Never lock the user's screen indefinitely
      timeoutId = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setShouldRender(false);
          onFinished?.();
        }, 450);
      }, maxTimeoutMs);
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading, maxTimeoutMs, onFinished]);

  if (!shouldRender) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white select-none transition-opacity duration-400 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-75 pointer-events-none" />

      {/* Main Coordinated Doodle Stage */}
      <div className="relative flex flex-col items-center max-w-sm w-full px-6 text-center z-10 space-y-6">
        {/* Animated Architectural Doodle Ring + StackMatch Logo */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Hand-drawn animated outer orbit line */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="0 0 112 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="#E5E7EB"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="animate-doodle-flow"
            />
            {/* Animated drawing sweep path */}
            <path
              d="M56 8C82.5 8 104 29.5 104 56C104 82.5 82.5 104 56 104C29.5 104 8 82.5 8 56"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-doodle-draw"
            />
            {/* Orbiting Satellite Node 1 (Idea) */}
            <circle cx="56" cy="8" r="4.5" fill="#2563EB" className="animate-ping" />
            <circle cx="56" cy="8" r="3.5" fill="#2563EB" />
            {/* Orbiting Satellite Node 2 (Tech Stack) */}
            <circle cx="104" cy="56" r="3" fill="#111827" />
            {/* Orbiting Satellite Node 3 (Architecture) */}
            <circle cx="56" cy="104" r="3" fill="#16A34A" />
            {/* Orbiting Satellite Node 4 (Blueprint) */}
            <circle cx="8" cy="56" r="3" fill="#2563EB" />
          </svg>

          {/* Central Logo Mark */}
          <div className="relative z-10 p-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-md transform transition-transform duration-300 hover:scale-105">
            <StackMatchLogo variant="mark" size="lg" />
          </div>
        </div>

        {/* Brand Title & Tagline */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-black tracking-tight text-[#111827]">StackMatch</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <span className="text-xs font-semibold text-[#687280]">Planning Studio</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-[#111827] tracking-tight">
            {message}
          </h3>

          <p className="text-xs text-[#687280] min-h-[18px] transition-all duration-200">
            {steps[activeStep]}
          </p>
        </div>

        {/* Fine Progress Shimmer Bar */}
        <div className="w-48 h-1 rounded-full bg-[#E5E7EB] overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-[#2563EB] w-1/3 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] animate-doodle-flow" />
        </div>
      </div>
    </div>
  );
};
