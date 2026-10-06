'use client';

import { useEffect, useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register Service Worker for offline PWA
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
          .catch((err) => console.warn('Service Worker registration failed:', err));
      });
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || !deferredPrompt) return null;

  return (
    <div className="bg-emerald-950 text-emerald-100 px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm border-b border-emerald-800">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Install <strong>AI Nature Quest</strong> on your home screen for full offline outdoor capability.</span>
      </div>
      <button
        onClick={handleInstallClick}
        className="ml-3 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-lg text-xs transition shrink-0"
      >
        Install PWA
      </button>
    </div>
  );
}
