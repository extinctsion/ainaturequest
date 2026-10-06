'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Clock,
  Sparkles,
  TreePine,
  Camera,
  Heart,
  HelpCircle,
  Dices,
  Flame,
  ChevronRight,
  Layers,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { getAIProvider, getActiveAIProviderType } from '../../../lib/ai';
import { createQuestSession } from '../../../lib/storage/session';
import { saveSettings } from '../../../lib/storage/settings';
import { AdventureType, DifficultyLevel } from '../../../lib/types/quest';
import SafetyBanner from '../../../components/SafetyBanner';

const DURATIONS = [
  { value: 15, label: '15 min', desc: 'Quick sensory reset' },
  { value: 30, label: '30 min', desc: 'Standard field stroll' },
  { value: 45, label: '45 min', desc: 'Deep neighborhood scout' },
  { value: 60, label: '60 min', desc: 'Extended wild immersion' },
];

const ADVENTURE_TYPES: { id: AdventureType; label: string; icon: typeof TreePine; desc: string }[] = [
  { id: 'nature', label: 'Nature', icon: TreePine, desc: 'Flora, leaves & botany' },
  { id: 'wildlife', label: 'Wildlife', icon: Flame, desc: 'Animals, insects & tracks' },
  { id: 'photography', label: 'Photography', icon: Camera, desc: 'Patterns, light & macro' },
  { id: 'exploration', label: 'Exploration', icon: Compass, desc: 'Uncharted local paths' },
  { id: 'mindfulness', label: 'Mindfulness', icon: Heart, desc: 'Sensory grounding & calm' },
  { id: 'mystery', label: 'Mystery', icon: HelpCircle, desc: 'Cryptic nature riddles' },
  { id: 'surprise', label: 'Surprise Me', icon: Dices, desc: 'AI curated combination' },
];

const DIFFICULTIES: { id: DifficultyLevel; label: string; stars: string; desc: string }[] = [
  { id: 'easy', label: 'Easy', stars: '★☆☆☆☆', desc: 'Gentle, immediate discoveries' },
  { id: 'moderate', label: 'Moderate', stars: '★★★☆☆', desc: 'Requires observant searching' },
  { id: 'challenging', label: 'Challenging', stars: '★★★★★', desc: 'Subtle signs & deep tracking' },
];

const DEMO_LOADING_MESSAGES = [
  'Looking at your surroundings...',
  'Choosing challenges...',
  'Balancing field objectives...',
  'Preparing your quest...',
];

const GEMMA_LOADING_MESSAGES = [
  'Gemma 3 is generating your outdoor quest...',
  'Gemma is enforcing safety and wildlife constraints...',
  'Gemma is structuring sensory field objectives...',
  'Finalizing expedition parameters...',
];

export default function NewQuestPage() {
  const router = useRouter();

  const [duration, setDuration] = useState<number>(30);
  const [adventureType, setAdventureType] = useState<AdventureType>('nature');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('moderate');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<'demo' | 'gemma' | 'custom'>('demo');

  useEffect(() => {
    setActiveProvider(getActiveAIProviderType());
  }, []);

  const isGemma = activeProvider === 'gemma';
  const loadingMessages = isGemma ? GEMMA_LOADING_MESSAGES : DEMO_LOADING_MESSAGES;

  const handleGenerateQuest = async (providerOverride?: 'demo' | 'gemma') => {
    setIsGenerating(true);
    setErrorMsg(null);
    setLoadingStep(0);

    const timer1 = setTimeout(() => setLoadingStep(1), 500);
    const timer2 = setTimeout(() => setLoadingStep(2), 1200);
    const timer3 = setTimeout(() => setLoadingStep(3), 2000);

    try {
      const targetProvider = providerOverride || activeProvider;
      const provider = getAIProvider(targetProvider);
      const generatedQuest = await provider.generateQuest({
        durationMinutes: duration,
        adventureType,
        difficulty,
        providerOverride: targetProvider,
      });

      // Save initial session
      createQuestSession(generatedQuest);

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      router.push(`/quest/${generatedQuest.id}`);
    } catch (err: unknown) {
      console.error('Failed to generate quest:', err);
      setIsGenerating(false);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Something went wrong while creating your quest. Try again or check your AI provider.'
      );
    }
  };

  const handleSwitchToDemoAndRetry = () => {
    saveSettings({ aiProvider: 'demo' });
    setActiveProvider('demo');
    setErrorMsg(null);
    handleGenerateQuest('demo');
  };

  if (isGenerating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto py-12 px-4 animate-in fade-in duration-300">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-900/10 dark:bg-emerald-400/10 border-2 border-emerald-500/30 flex items-center justify-center animate-pulse-gentle">
            {isGemma ? (
              <Layers className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
            ) : (
              <Compass className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            )}
          </div>
          <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            {loadingMessages[loadingStep]}
          </h2>
          <p className="text-xs uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-400">
            {isGemma ? 'Live Gemma 3 4B Inference in Progress' : 'Synthesizing Field Parameters'}
          </p>
        </div>

        <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-2 sm:py-4">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <Compass className="w-4 h-4" />
            <span>New Expedition</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            {isGemma ? (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <Layers className="w-3 h-3" /> Gemma Mode
              </span>
            ) : (
              <span className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                <Sparkles className="w-3 h-3" /> Demo Mode
              </span>
            )}
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
          Create Your Quest
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
          Configure your walk parameters. AI will generate field objectives designed for minimal screen usage.
        </p>
      </div>

      {errorMsg && (
        <div className="p-5 bg-red-950/20 border-2 border-red-500/40 text-red-800 dark:text-red-200 rounded-2xl text-sm space-y-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold text-base">Error generating quest with {isGemma ? 'Gemma' : 'AI'}</p>
              <p className="text-xs text-stone-700 dark:text-stone-300 font-mono leading-relaxed">{errorMsg}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-red-500/20">
            <button
              type="button"
              onClick={() => handleGenerateQuest()}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Generation</span>
            </button>

            {isGemma && (
              <button
                type="button"
                onClick={handleSwitchToDemoAndRetry}
                className="px-3.5 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Switch to Demo AI (Instant)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 1: Duration */}
      <section className="field-journal-card rounded-2xl p-5 sm:p-6 space-y-4 border border-stone-300 dark:border-stone-800">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold">How much time do you have?</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DURATIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDuration(d.value)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                duration === d.value
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-md scale-[1.02]'
                  : 'bg-stone-50 dark:bg-stone-900/60 border-stone-300 dark:border-stone-700 hover:border-emerald-600 text-stone-800 dark:text-stone-200'
              }`}
            >
              <div className="text-lg font-extrabold">{d.label}</div>
              <div
                className={`text-[11px] mt-0.5 ${
                  duration === d.value ? 'text-emerald-200' : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {d.desc}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Step 2: Adventure Type */}
      <section className="field-journal-card rounded-2xl p-5 sm:p-6 space-y-4 border border-stone-300 dark:border-stone-800">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold">What kind of adventure?</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ADVENTURE_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = adventureType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setAdventureType(type.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-md scale-[1.02]'
                    : 'bg-stone-50 dark:bg-stone-900/60 border-stone-300 dark:border-stone-700 hover:border-emerald-600 text-stone-800 dark:text-stone-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  />
                  <span className="font-bold text-sm">{type.label}</span>
                </div>
                <div
                  className={`text-[11px] mt-1 line-clamp-1 ${
                    isSelected ? 'text-emerald-200' : 'text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {type.desc}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 3: Difficulty */}
      <section className="field-journal-card rounded-2xl p-5 sm:p-6 space-y-4 border border-stone-300 dark:border-stone-800">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <Flame className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold">Difficulty</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DIFFICULTIES.map((diff) => {
            const isSelected = difficulty === diff.id;
            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => setDifficulty(diff.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-md scale-[1.02]'
                    : 'bg-stone-50 dark:bg-stone-900/60 border-stone-300 dark:border-stone-700 hover:border-emerald-600 text-stone-800 dark:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{diff.label}</span>
                  <span className="text-xs tracking-widest text-amber-400">{diff.stars}</span>
                </div>
                <div
                  className={`text-[11px] mt-1 ${
                    isSelected ? 'text-emerald-200' : 'text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {diff.desc}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Outdoor Safety Banner */}
      <SafetyBanner compact />

      {/* Primary CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => handleGenerateQuest()}
          className="w-full py-4 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-emerald-950/20 hover:shadow-emerald-950/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isGemma ? <Layers className="w-5 h-5 text-emerald-300" /> : <Sparkles className="w-5 h-5 text-emerald-300" />}
          <span>{isGemma ? 'Generate Quest with Gemma 3' : 'Generate My Quest'}</span>
          <ChevronRight className="w-5 h-5 text-emerald-300" />
        </button>
      </div>
    </div>
  );
}
