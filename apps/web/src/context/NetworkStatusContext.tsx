import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface NetworkStatusContextType {
  isOnline: boolean;
  isBackendReachable: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  checkConnection: () => Promise<boolean>;
}

const NetworkStatusContext = createContext<NetworkStatusContextType>({
  isOnline: true,
  isBackendReachable: true,
  isChecking: false,
  lastChecked: null,
  checkConnection: async () => true,
});

export const NetworkStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isBackendReachable, setIsBackendReachable] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(new Date());

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    const deviceOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    setIsOnline(deviceOnline);

    if (!deviceOnline) {
      setIsBackendReachable(false);
      setIsChecking(false);
      setLastChecked(new Date());
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('/api/v1/health', {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const reachable = res.ok;
      setIsBackendReachable(reachable);
      setLastChecked(new Date());
      setIsChecking(false);
      return reachable;
    } catch (_) {
      // Backend ping failed, device may still be online but backend is unreachable
      setIsBackendReachable(false);
      setLastChecked(new Date());
      setIsChecking(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsBackendReachable(false);
      setLastChecked(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check on mount
    checkConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection]);

  return (
    <NetworkStatusContext.Provider
      value={{
        isOnline,
        isBackendReachable,
        isChecking,
        lastChecked,
        checkConnection,
      }}
    >
      {children}
    </NetworkStatusContext.Provider>
  );
};

export const useNetworkStatus = () => useContext(NetworkStatusContext);
