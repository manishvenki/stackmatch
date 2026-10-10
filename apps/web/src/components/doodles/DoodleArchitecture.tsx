import React from 'react';

export interface DoodleArchitectureProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export const DoodleArchitecture: React.FC<DoodleArchitectureProps> = ({
  className = '',
}) => {
  return (
    <div className={`relative p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm select-none ${className}`}>
      {/* Background blueprint grid marks */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:16px_16px] rounded-2xl opacity-60 pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Node 1: Client Layer */}
        <div className="flex-1 w-full sm:w-auto p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-center relative group">
          <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">
            Tier 1 • Client
          </span>
          <p className="text-xs font-bold text-[#111827] mt-0.5">Web & Mobile PWA</p>
          <span className="text-[10px] text-[#687280]">React + Tailwind</span>
          <div className="w-2 h-2 rounded-full bg-[#16A34A] mx-auto mt-2 animate-pulse" />
        </div>

        {/* Dynamic Vector Connector Line 1 */}
        <div className="hidden sm:flex flex-col items-center justify-center px-1">
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
            <path
              d="M2 10H38"
              stroke="#2563EB"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="animate-doodle-flow"
            />
            <circle cx="20" cy="10" r="3" fill="#2563EB" className="animate-ping" />
          </svg>
          <span className="text-[9px] text-[#9CA3AF] font-mono mt-0.5">REST/WS</span>
        </div>

        {/* Node 2: Gateway & Business Logic */}
        <div className="flex-1 w-full sm:w-auto p-3 rounded-xl bg-[#F9FAFB] border border-[#2563EB]/40 ring-1 ring-[#2563EB]/20 text-center relative shadow-2xs">
          <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">
            Tier 2 • Gateway
          </span>
          <p className="text-xs font-bold text-[#111827] mt-0.5">Node.js / Express</p>
          <span className="text-[10px] text-[#687280]">Auth & Scoping Engine</span>
          <div className="w-2 h-2 rounded-full bg-[#2563EB] mx-auto mt-2" />
        </div>

        {/* Dynamic Vector Connector Line 2 */}
        <div className="hidden sm:flex flex-col items-center justify-center px-1">
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
            <path
              d="M2 10H38"
              stroke="#2563EB"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="animate-doodle-flow"
            />
            <circle cx="20" cy="10" r="3" fill="#2563EB" className="animate-ping" />
          </svg>
          <span className="text-[9px] text-[#9CA3AF] font-mono mt-0.5">TCP/TLS</span>
        </div>

        {/* Node 3: Persistence & Cache */}
        <div className="flex-1 w-full sm:w-auto p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-center relative">
          <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">
            Tier 3 • Storage
          </span>
          <p className="text-xs font-bold text-[#111827] mt-0.5">MongoDB + Redis</p>
          <span className="text-[10px] text-[#687280]">Replica Cluster</span>
          <div className="w-2 h-2 rounded-full bg-[#16A34A] mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
};
