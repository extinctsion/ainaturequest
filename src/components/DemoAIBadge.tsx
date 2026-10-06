'use client';

import { useState } from 'react';
import { Sparkles, Cpu, ShieldCheck, X, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function DemoAIBadge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        aria-label="View AI Provider Architecture information"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/50 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-all cursor-pointer shadow-xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>DEMO AI</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl shadow-2xl p-6 text-stone-900 dark:text-stone-100">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Deterministic Demo AI Mode</h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Open-Source Architecture
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              <p>
                This public demonstration runs using a <strong>deterministic Demo AI Provider</strong>, allowing the complete outdoor quest experience to be explored immediately with zero API keys or network latency.
              </p>
              <div className="p-3 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Provider-Independent Interface
                </div>
                <p>
                  The codebase adheres to the <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded">AIProvider</code> interface. Open-weight foundation models like <strong>Google Gemma</strong> can be plugged in via <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded">AI_PROVIDER=gemma</code> without rewriting any frontend or game loop logic.
                </p>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Built for the DEV.to Hacktoberfest Open-Source AI Challenge: <em>Touch Grass</em>.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold text-sm transition shadow-sm"
              >
                <span>View AI Settings & Architecture</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-4 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
