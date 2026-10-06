'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Clock,
  Sparkles,
  TreePine,
  Camera,
  Search,
  Heart,
  HelpCircle,
  Dices,
  Flame,
  ShieldCheck,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { getAIProvider } from '../../../lib/ai';
import { createQuestSession } from '../../../lib/storage/session';
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

const LOADING_MESSAGES = [
  'Looking at your surroundings...',
  'Choosing challenges...',
  'Balancing field objectives...',
  'Preparing your quest...',
];

export default function NewQuestPage() {
  const router = useRouter();

  const [duration, setDuration] = useState<number>(30);
  const [adventureType, setAdventureType] = useState<AdventureType>('nature');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('moderate');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateQuest = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setLoadingStep(0);

    // Step cycle for realistic generation experience
    const timer1 = setTimeout(() => setLoadingStep(1), 300);
    const timer2 = setTimeout(() => setLoadingStep(2), 600);
    const timer3 = setTimeout(() => setLoadingStep(3), 900);

    try {
      const provider = getAIProvider();
      const generatedQuest = await provider.generateQuest({
        durationMinutes: duration,
        adventureType,
        difficulty,
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
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Something went wrong while creating your quest. Try again.'
      );
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto py-12 px-4 animate-in fade-in duration-300">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-900/10 dark:bg-emerald-400/10 border-2 border-emerald-500/30 flex items-center justify-center animate-pulse-gentle">
            <Compass className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            {LOADING_MESSAGES[loadingStep]}
          </h2>
          <p className="text-xs uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-400">
            Synthesizing field parameters
          </p>
        </div>

        <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${((loadingStep + 1) / LOADING_MESSAGES.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-2 sm:py-4">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <Compass className="w-4 h-4" />
          <span>New Expedition</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
          Create Your Quest
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
          Configure your walk parameters. AI will generate field objectives designed for minimal screen usage.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-900/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-2xl text-sm">
          <p className="font-bold">Error generating quest</p>
          <p className="text-xs mt-1">{errorMsg}</p>
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
          onClick={handleGenerateQuest}
          className="w-full py-4 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-emerald-950/20 hover:shadow-emerald-950/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-emerald-300" />
          <span>Generate My Quest</span>
          <ChevronRight className="w-5 h-5 text-emerald-300" />
        </button>
      </div>
    </div>
  );
}
