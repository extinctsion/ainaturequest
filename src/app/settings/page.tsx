'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Cpu,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Info,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Code2,
  TreePine,
  Layers,
} from 'lucide-react';
import {
  getSettings,
  saveSettings,
  resetAllData,
} from '../../lib/storage/settings';
import { clearJournal } from '../../lib/storage/journal';
import { clearQuestHistory } from '../../lib/storage/quests';
import { resetProgress } from '../../lib/storage/progress';
import { clearActiveQuestSession } from '../../lib/storage/session';
import { AppSettings } from '../../lib/types/quest';

export default function SettingsPage() {
  const [settings, setSettingsState] = useState<AppSettings | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfirmResetAll, setShowConfirmResetAll] = useState<boolean>(false);

  useEffect(() => {
    setSettingsState(getSettings());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClearJournal = () => {
    clearJournal();
    showToast('Nature Journal entries cleared.');
  };

  const handleClearHistory = () => {
    clearQuestHistory();
    showToast('Quest history records cleared.');
  };

  const handleResetProgress = () => {
    resetProgress();
    showToast('Level, XP, and badges reset to initial rank.');
  };

  const handleResetAll = () => {
    resetAllData();
    setShowConfirmResetAll(false);
    showToast('All local application data reset successfully.');
  };

  if (!settings) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-2 sm:py-4">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <Settings className="w-4 h-4" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-stone-100">
          Settings
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
          AI PROVIDER & LOCAL DATA MANAGEMENT
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 rounded-2xl text-sm font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AI Provider Architecture Section */}
      <section className="field-journal-card rounded-3xl p-6 sm:p-8 border border-stone-300 dark:border-stone-800 space-y-6">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold">AI Provider Configuration</h2>
        </div>

        <div className="space-y-3">
          {/* Demo AI Card */}
          <div className="p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-900/10 dark:bg-emerald-950/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                  Demo AI (Deterministic Open Mode)
                </span>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                Active Provider
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Currently using deterministic demo responses for seamless zero-key evaluation. Provides authentic naturalist feedback, confidence scoring, and XP progression.
            </p>
          </div>

          {/* Gemma Open-Weight Card */}
          <div className="p-4 rounded-2xl border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40 space-y-2 opacity-80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-stone-500" />
                <span className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                  Google Gemma (Open-Weight Model)
                </span>
              </div>
              <span className="px-2.5 py-0.5 bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full text-[10px] font-bold uppercase">
                Staged / Not Configured
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              To connect a live open-weight Gemma model, configure <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded text-emerald-600">AI_PROVIDER=gemma</code> and <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded text-emerald-600">AI_API_URL</code> in your <code className="text-stone-700 dark:text-stone-300 font-mono">.env</code> file. The UI layer communicates exclusively through the <code className="text-stone-700 dark:text-stone-300 font-mono">AIProvider</code> interface.
            </p>
          </div>
        </div>
      </section>

      {/* Local Storage & Data Management */}
      <section className="field-journal-card rounded-3xl p-6 sm:p-8 border border-stone-300 dark:border-stone-800 space-y-6">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <Trash2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold">Local Data & Privacy</h2>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          AI Nature Quest does not use cookies, user tracking, or remote databases. All quest history, photos, and journal entries are stored strictly inside your browser&apos;s local storage.
        </p>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3.5 bg-stone-100 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
            <div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Clear Nature Journal
              </h4>
              <p className="text-xs text-stone-500">Remove all saved discoveries and photos.</p>
            </div>
            <button
              type="button"
              onClick={handleClearJournal}
              className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-stone-100 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
            <div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Clear Quest History
              </h4>
              <p className="text-xs text-stone-500">Remove past completed expedition logs.</p>
            </div>
            <button
              type="button"
              onClick={handleClearHistory}
              className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-stone-100 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
            <div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Reset Progress & Badges
              </h4>
              <p className="text-xs text-stone-500">Reset Level, XP, and unlocked field badges.</p>
            </div>
            <button
              type="button"
              onClick={handleResetProgress}
              className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Wipe All Data Button */}
          <div className="pt-2">
            {!showConfirmResetAll ? (
              <button
                type="button"
                onClick={() => setShowConfirmResetAll(true)}
                className="w-full py-3 px-4 bg-red-900/10 hover:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-500/30 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Reset All Application Data</span>
              </button>
            ) : (
              <div className="p-4 bg-red-950/20 border border-red-500/40 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-red-700 dark:text-red-300">
                  Are you sure? This permanently deletes all journal entries, quest sessions, and progress.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmResetAll(false)}
                    className="flex-1 py-2 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="field-journal-card rounded-3xl p-6 sm:p-8 border border-stone-300 dark:border-stone-800 space-y-4">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold">About AI Nature Quest</h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          <p>
            <strong>AI Nature Quest</strong> is an open-source experiment built for the <strong>DEV.to Hacktoberfest Open-Source AI Challenge: Touch Grass</strong>.
          </p>
          <p>
            The game is designed around an inverse screentime philosophy: the better you play the game, the less you look at your screen.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-200 dark:border-stone-800">
          <span>Version 1.0.0 (Production Build)</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-stone-700 dark:text-stone-300 hover:text-emerald-600"
          >
            <Code2 className="w-4 h-4" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>
    </div>
  );
}
