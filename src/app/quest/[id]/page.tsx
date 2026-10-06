'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  Clock,
  Flame,
  Award,
  Camera,
  Volume2,
  FileText,
  HelpCircle,
  Play,
  ArrowLeft,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { getActiveQuestSession, updateSessionStatus } from '../../../lib/storage/session';
import { DEMO_QUEST_DATABASE } from '../../../lib/ai/demo-provider';
import { Quest, QuestObjective } from '../../../lib/types/quest';
import SafetyBanner from '../../../components/SafetyBanner';

export default function QuestBriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Try to load from active session
    const session = getActiveQuestSession();
    if (session && session.quest.id === resolvedParams.id) {
      setQuest(session.quest);
      setLoading(false);
      return;
    }

    // 2. Fallback to database lookup
    const found = DEMO_QUEST_DATABASE.find((q) => q.id === resolvedParams.id);
    if (found) {
      setQuest(found);
    } else if (session) {
      setQuest(session.quest);
    } else {
      // Default fallback
      setQuest(DEMO_QUEST_DATABASE[0]);
    }
    setLoading(false);
  }, [resolvedParams.id]);

  const handleStartQuest = () => {
    if (!quest) return;
    updateSessionStatus('active');
    router.push(`/quest/${quest.id}/active`);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Compass className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">Loading expedition briefing...</p>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold">Quest not found</h2>
        <Link
          href="/quest/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold text-sm"
        >
          Create a New Quest
        </Link>
      </div>
    );
  }

  const renderEvidenceIcon = (type: QuestObjective['evidenceType']) => {
    switch (type) {
      case 'photo':
        return <Camera className="w-3.5 h-3.5" />;
      case 'audio':
        return <Volume2 className="w-3.5 h-3.5" />;
      case 'text':
        return <FileText className="w-3.5 h-3.5" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5" />;
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(Math.max(0, 5 - difficulty));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 py-2">
      {/* Back button */}
      <Link
        href="/quest/new"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Change Quest Parameters</span>
      </Link>

      {/* Field Journal Briefing Header */}
      <div className="field-journal-card rounded-3xl p-6 sm:p-8 border border-stone-300 dark:border-stone-800 space-y-6 relative overflow-hidden">
        {/* Subtle decorative stamp */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          {quest.aiMetadata && (
            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-900/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
              {quest.aiMetadata.provider === 'gemma' ? 'Gemma 3 4B' : 'Demo AI'}
            </span>
          )}
          <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded-md bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-stone-700">
            Dispatch #{quest.id.slice(0, 8)}
          </span>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-black tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
            AI NATURE QUEST
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
            {quest.title.toUpperCase()}
          </h1>
          {quest.subtitle && (
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              {quest.subtitle}
            </p>
          )}
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-b border-stone-200 dark:border-stone-800 py-3 text-xs font-bold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800/80 rounded-xl text-stone-800 dark:text-stone-200">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{quest.durationMinutes} MINUTES</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800/80 rounded-xl text-stone-800 dark:text-stone-200">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="tracking-widest text-amber-500">{getDifficultyStars(quest.difficulty)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-500/30 ml-auto">
            <Award className="w-4 h-4" />
            <span>+{quest.totalXp} XP</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
          {quest.description}
        </p>
      </div>

      {/* Objectives List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-widest text-stone-500 dark:text-stone-400">
            TODAY&apos;S OBJECTIVES ({quest.objectives.length})
          </h2>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            All required for completion
          </span>
        </div>

        <div className="space-y-3">
          {quest.objectives.map((obj, index) => (
            <div
              key={obj.id}
              className="field-journal-card rounded-2xl p-5 border border-stone-300 dark:border-stone-800 flex gap-4 items-start"
            >
              <div className="w-9 h-9 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-black text-sm flex items-center justify-center shrink-0">
                0{index + 1}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    {obj.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700">
                      {renderEvidenceIcon(obj.evidenceType)}
                      <span>{obj.evidenceType}</span>
                    </span>
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                      +{obj.xp} XP
                    </span>
                  </div>
                </div>

                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {obj.description}
                </p>

                {obj.hint && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 italic pt-0.5">
                    Tip: {obj.hint}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Banner */}
      <SafetyBanner compact />

      {/* Start Quest Primary Action */}
      <div className="pt-2 sticky bottom-4 z-20">
        <button
          type="button"
          onClick={handleStartQuest}
          className="w-full py-4 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-950/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current text-emerald-300" />
          <span>Start Quest</span>
        </button>
      </div>
    </div>
  );
}
