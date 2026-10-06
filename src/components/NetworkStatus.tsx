'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider transition-colors duration-200 border ${
        isOnline
          ? 'bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
          : 'bg-amber-950/30 text-amber-500 border-amber-500/40'
      }`}
      title={
        isOnline
          ? 'Application online and ready'
          : 'Offline mode active. Quests, timer, and journal are saved locally.'
      }
    >
      <span
        className={`inline-block w-2 h-2 rounded-full ${
          isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
        }`}
      />
      <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
    </div>
  );
}
