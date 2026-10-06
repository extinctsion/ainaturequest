'use client';

import { ShieldAlert, Compass } from 'lucide-react';

interface SafetyBannerProps {
  compact?: boolean;
}

export default function SafetyBanner({ compact = false }: SafetyBannerProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-amber-900 dark:text-amber-200/90 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>Stay on public safe paths. Never ingest or touch unknown wild plants.</span>
      </div>
    );
  }

  return (
    <aside aria-label="Field Safety Guidelines" className="w-full bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4 sm:p-5 text-amber-950 dark:text-amber-100">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-xl shrink-0 mt-0.5">
          <Compass className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm space-y-1">
          <h4 className="font-bold tracking-wide text-amber-900 dark:text-amber-200 uppercase text-xs">
            Outdoor Naturalist Safety Advisory
          </h4>
          <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
            Stay on marked safe paths, respect wildlife distance, maintain spatial awareness, and never eat or touch an unknown plant based solely on an AI suggestion.
          </p>
        </div>
      </div>
    </aside>
  );
}
