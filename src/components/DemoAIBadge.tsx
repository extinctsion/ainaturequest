'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Cpu, ShieldCheck, X, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getActiveAIProviderType } from '../lib/ai';

export default function DemoAIBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'demo' | 'gemma' | 'custom'>('demo');

  useEffect(() => {
    setActiveProvider(getActiveAIProviderType());

    const handleSettingsChanged = () => {
      setActiveProvider(getActiveAIProviderType());
    };

    window.addEventListener('settings-changed', handleSettingsChanged);
    return () => {
      window.removeEventListener('settings-changed', handleSettingsChanged);
    };
  }, []);

  const isGemma = activeProvider === 'gemma';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        aria-label="View AI Provider Architecture information"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black tracking-wider border transition-all cursor-pointer shadow-xs ${
          isGemma
            ? 'bg-emerald-800 text-white border-emerald-600 hover:bg-emerald-900 animate-pulse-gentle'
            : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/50 hover:bg-emerald-200 dark:hover:bg-emerald-800/50'
        }`}
      >
        {isGemma ? (
          <>
            <Layers className="w-3.5 h-3.5 text-emerald-300" />
            <span>GEMMA 3 4B</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>DEMO AI</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl shadow-2xl p-6 text-stone-900 dark:text-stone-100">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
                {isGemma ? <Layers className="w-6 h-6" /> : <Cpu className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">
                  {isGemma ? 'Google Gemma 3 (Open-Weight Model)' : 'Deterministic Demo AI Mode'}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {isGemma ? 'Active Local Inference' : 'Open-Source Architecture'}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {isGemma ? (
                <>
                  <p>
                    AI Nature Quest is currently running with <strong>Google Gemma 3 4B</strong> open-weight model inference via your configured inference endpoint (Ollama).
                  </p>
                  <div className="p-3 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-1.5">
                    <div className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Real Multimodal Inference Active
                    </div>
                    <p>
                      Quests and evidence evaluations are generated directly by Gemma 3. No private API keys or evidence images are stored on remote third-party servers.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    This mode runs using a <strong>deterministic Demo AI Provider</strong>, allowing the complete outdoor quest experience to be explored immediately with zero API keys or network latency.
                  </p>
                  <div className="p-3 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-1">
                    <div className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Pluggable AI Architecture
                    </div>
                    <p>
                      The codebase adheres to the <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded">AIProvider</code> interface. You can switch to <strong>Gemma 3</strong> anytime in Settings.
                    </p>
                  </div>
                </>
              )}

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
                <span>Change AI Provider in Settings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-4 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer"
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
