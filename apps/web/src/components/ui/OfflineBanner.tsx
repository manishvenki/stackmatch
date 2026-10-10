import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useNetworkStatus } from '../../context/NetworkStatusContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, isChecking, checkConnection } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-[#111827] text-white px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-[#374151] z-50 sticky top-0"
    >
      <div className="flex items-center gap-2.5">
        <span className="p-1 rounded-md bg-[#EF4444]/20 text-[#EF4444] shrink-0">
          <WifiOff className="w-3.5 h-3.5" />
        </span>
        <span className="font-medium text-[#F3F4F6]">
          You are currently offline. Any changes will be preserved locally until connection returns.
        </span>
      </div>

      <button
        type="button"
        onClick={() => checkConnection()}
        disabled={isChecking}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors disabled:opacity-50 text-[11px] cursor-pointer"
      >
        <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
        <span>{isChecking ? 'Rechecking...' : 'Retry Connection'}</span>
      </button>
    </div>
  );
};
