'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Settings,
  Cpu,
  Trash2,
  Sparkles,
  Info,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Code2,
  Layers,
  Activity,
  Terminal,
  Server,
  RefreshCw,
} from 'lucide-react';
import {
  getSettings,
  saveSettings,
  resetAllData,
  DEFAULT_SETTINGS,
} from '../../lib/storage/settings';
import { clearJournal } from '../../lib/storage/journal';
import { clearQuestHistory } from '../../lib/storage/quests';
import { resetProgress } from '../../lib/storage/progress';
import { AppSettings, AIHealthStatus } from '../../lib/types/quest';

export default function SettingsPage() {
  const [settings, setSettingsState] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      return getSettings();
    }
    return DEFAULT_SETTINGS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfirmResetAll, setShowConfirmResetAll] = useState<boolean>(false);

  // Gemma connection test state
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [healthStatus, setHealthStatus] = useState<AIHealthStatus | null>(null);

  const checkHealth = useCallback(async () => {
    setIsTestingConnection(true);
    try {
      const res = await fetch('/api/ai/health', { method: 'GET' });
      const data = (await res.json()) as AIHealthStatus;
      setHealthStatus(data);
    } catch (err) {
      setHealthStatus({
        ok: false,
        provider: 'gemma',
        model: 'gemma3:4b',
        latencyMs: 0,
        message: err instanceof Error ? err.message : 'Failed to reach health endpoint',
      });
    } finally {
      setIsTestingConnection(false);
    }
  }, []);

  useEffect(() => {
    // Initial sync
    const current = getSettings();
    setSettingsState(current);

    // If initial provider is gemma, run health check
    if (current.aiProvider === 'gemma') {
      checkHealth();
    }

    const handleSettingsChanged = () => {
      setSettingsState(getSettings());
    };

    window.addEventListener('settings-changed', handleSettingsChanged);
    return () => {
      window.removeEventListener('settings-changed', handleSettingsChanged);
    };
  }, [checkHealth]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleProviderChange = (provider: 'demo' | 'gemma') => {
    const updated = saveSettings({ aiProvider: provider });
    setSettingsState(updated);
    showToast(`AI Provider switched to ${provider === 'gemma' ? 'Google Gemma (Open-Weight)' : 'Demo AI'}.`);

    if (provider === 'gemma') {
      checkHealth();
    } else {
      setHealthStatus(null);
    }
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

  const configuredModel = 'Gemma 3 4B (gemma3:4b)';

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold">AI Provider Selection</h2>
          </div>
          <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            {settings.aiProvider === 'gemma' ? 'Gemma Active' : 'Demo AI Active'}
          </span>
        </div>

        {/* Provider Switcher Selector Buttons */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-200/70 dark:bg-stone-900 rounded-2xl border border-stone-300 dark:border-stone-800">
          <button
            type="button"
            onClick={() => handleProviderChange('demo')}
            className={`py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              settings.aiProvider === 'demo'
                ? 'bg-emerald-800 text-white shadow-md scale-[1.01]'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Demo AI</span>
          </button>

          <button
            type="button"
            onClick={() => handleProviderChange('gemma')}
            className={`py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              settings.aiProvider === 'gemma'
                ? 'bg-emerald-800 text-white shadow-md scale-[1.01]'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gemma (Local AI)</span>
          </button>
        </div>

        {/* Conditional Provider Information Card */}
        {settings.aiProvider === 'demo' ? (
          /* DEMO AI CARD */
          <div className="p-5 rounded-2xl border-2 border-emerald-600/60 bg-emerald-900/10 dark:bg-emerald-950/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                  Demo AI
                </h3>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                Zero-Config Default
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              Deterministic responses tailored for outdoor naturalist exploration. Provides authentic naturalist feedback, confidence calibration, and full XP progression.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-600 dark:text-stone-400">
              <span className="inline-flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Works without an API key
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> 100% Offline Compatible
              </span>
            </div>
          </div>
        ) : (
          /* GEMMA OPEN-WEIGHT CARD */
          <div className="p-5 rounded-2xl border-2 border-emerald-600/70 bg-emerald-950/20 dark:bg-stone-900/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                  Gemma
                </h3>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-700 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                Open-Weight Local AI
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              Runs through your configured Gemma endpoint with real open-weight model inference for quest generation and multimodal evidence evaluation.
            </p>

            {/* Model & Endpoint Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px] block">
                  Configured Model
                </span>
                <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                  {configuredModel}
                </span>
              </div>

              <div className="p-3 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px] block">
                  Connection Status
                </span>
                <div className="flex items-center gap-2">
                  {isTestingConnection ? (
                    <span className="flex items-center gap-1.5 font-bold text-amber-600">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing connection...</span>
                    </span>
                  ) : healthStatus?.ok ? (
                    <span className="flex items-center gap-1.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>● Connected ({healthStatus.latencyMs}ms)</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-extrabold text-amber-600 dark:text-amber-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>● Not connected</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Health Test Result Output */}
            {healthStatus && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-semibold leading-relaxed ${
                  healthStatus.ok
                    ? 'bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-500/40'
                }`}
              >
                <div className="flex items-start gap-2">
                  {healthStatus.ok ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p>{healthStatus.message}</p>
                    {healthStatus.availableModels && healthStatus.availableModels.length > 0 && (
                      <p className="text-[11px] opacity-80">
                        Installed in Ollama: {healthStatus.availableModels.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Test Connection Button */}
            <div>
              <button
                type="button"
                disabled={isTestingConnection}
                onClick={checkHealth}
                className="py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Activity className="w-4 h-4 text-emerald-300" />
                <span>{isTestingConnection ? 'Testing...' : 'Test Gemma Connection'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Developer Setup Section */}
        <div className="p-5 bg-stone-100 dark:bg-stone-900/70 rounded-2xl border border-stone-300 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <Terminal className="w-4 h-4 text-emerald-600" />
            <h4 className="font-extrabold text-sm uppercase tracking-wider">
              Developer Gemma Setup Guide
            </h4>
          </div>

          <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300 font-mono">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-md bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 shrink-0">
                1
              </span>
              <span className="pt-0.5 font-sans">
                Install Ollama from <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold underline">ollama.com</a>
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-md bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 shrink-0">
                2
              </span>
              <div className="space-y-1">
                <span className="pt-0.5 font-sans block">Pull the recommended multimodal model:</span>
                <code className="block p-2 rounded-lg bg-stone-900 text-emerald-400 font-mono text-[11px]">
                  ollama pull gemma3:4b
                </code>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-md bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 shrink-0">
                3
              </span>
              <div className="space-y-1">
                <span className="pt-0.5 font-sans block">Start Ollama service:</span>
                <code className="block p-2 rounded-lg bg-stone-900 text-emerald-400 font-mono text-[11px]">
                  ollama serve
                </code>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-md bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 shrink-0">
                4
              </span>
              <span className="pt-0.5 font-sans">
                Set <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded text-emerald-600 font-bold">AI_PROVIDER=gemma</code> in your <code className="font-mono">.env.local</code> or switch provider toggle above.
              </span>
            </div>
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
          AI Nature Quest does not use cookies, user tracking, or remote tracking databases. All quest history, photos, and journal entries are stored strictly inside your browser&apos;s local storage.
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
          <span>Version 1.1.0 (Gemma 3 Edition)</span>
          <a
            href="https://github.com/extinctsion/ainaturequest"
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
