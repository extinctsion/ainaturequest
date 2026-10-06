'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  TreePine,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  RotateCcw,
  Share2,
} from 'lucide-react';
import {
  getActiveQuestSession,
  clearActiveQuestSession,
  saveActiveQuestSession,
} from '../../../../lib/storage/session';
import { addXpAndQuestCompletion, getProgress } from '../../../../lib/storage/progress';
import { saveMultipleJournalEntries } from '../../../../lib/storage/journal';
import { saveCompletedQuestRecord } from '../../../../lib/storage/quests';
import { DEMO_QUEST_DATABASE } from '../../../../lib/ai/demo-provider';
import { Quest, QuestSession, JournalEntry } from '../../../../lib/types/quest';

export default function QuestCompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [session, setSession] = useState<QuestSession | null>(null);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [isSavedToJournal, setIsSavedToJournal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [totalXp, setTotalXp] = useState<number>(0);

  useEffect(() => {
    // 1. Fire celebratory nature confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#059669', '#d97706'],
      });
    } catch {
      // Ignored if confetti context is restricted
    }

    // 2. Load active session
    let currentSession = getActiveQuestSession();
    if (!currentSession || currentSession.quest.id !== resolvedParams.id) {
      const fallback =
        DEMO_QUEST_DATABASE.find((q) => q.id === resolvedParams.id) ||
        DEMO_QUEST_DATABASE[0];
      currentSession = {
        id: `session_${Date.now()}_${fallback.id}`,
        quest: fallback,
        startTime: Date.now() - 30 * 60 * 1000,
        targetEndTime: Date.now(),
        status: 'completed',
        elapsedSeconds: 30 * 60,
        submittedEvidence: {},
        evaluations: {},
        totalXpEarned: fallback.totalXp,
      };
    }

    setSession(currentSession);
    setQuest(currentSession.quest);

    // 3. Award XP & Log Quest to progress if not already awarded
    const earnedXp = currentSession.quest.totalXp;
    const discoveriesCount = Object.keys(currentSession.submittedEvidence).length || currentSession.quest.objectives.length;
    const progress = addXpAndQuestCompletion(
      currentSession.quest.id,
      earnedXp,
      currentSession.quest.durationMinutes,
      discoveriesCount
    );

    setUserLevel(progress.level);
    setTotalXp(progress.totalXp);

    // 4. Save to Quest History
    saveCompletedQuestRecord({
      id: currentSession.id,
      quest: currentSession.quest,
      completedAt: Date.now(),
      xpEarned: earnedXp,
      durationMinutes: currentSession.quest.durationMinutes,
      objectivesCompletedCount: currentSession.quest.objectives.length,
    });
  }, [resolvedParams.id]);

  const handleSaveToNatureJournal = () => {
    if (!quest) return;

    const entries: JournalEntry[] = quest.objectives.map((obj, i) => {
      const evidence = session?.submittedEvidence[obj.id];
      const evaluation = session?.evaluations[obj.id];

      return {
        id: `journal_${Date.now()}_${quest.id}_${i}`,
        questId: quest.id,
        questTitle: quest.title,
        title: obj.title,
        observation:
          evidence?.note ||
          (evidence?.type === 'text' ? evidence.data : '') ||
          evaluation?.feedback ||
          obj.description,
        photoData: evidence?.type === 'photo' ? evidence.data : undefined,
        evidenceType: obj.evidenceType,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        timestamp: Date.now(),
        xp: obj.xp,
        category: quest.category,
        location: 'Field Expedition Route',
        aiMetadata: quest.aiMetadata || {
          provider: evaluation?.model ? 'gemma' : 'demo',
          model: evaluation?.model || 'demo',
        },
      };
    });

    saveMultipleJournalEntries(entries);
    setIsSavedToJournal(true);
    setToastMessage('🌿 All discoveries successfully saved to your Nature Journal!');

    if (session) {
      const updated = { ...session, savedToJournal: true };
      saveActiveQuestSession(updated);
    }
  };

  const handleStartAnother = () => {
    clearActiveQuestSession();
    router.push('/quest/new');
  };

  if (!quest) return null;

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 space-y-8 text-center animate-in fade-in duration-300">
      {/* Celebration Header */}
      <div className="space-y-4">
        <div className="w-24 h-24 rounded-full bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
          <Award className="w-12 h-12 animate-pulse-gentle" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            EXPEDITION ACCOMPLISHED
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
            QUEST COMPLETE
          </h1>
          <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
            <span>🌿</span>
            <span>{quest.title}</span>
          </p>
        </div>
      </div>

      {/* Completion Metrics & Summary Card */}
      <div className="field-journal-card rounded-3xl p-6 sm:p-8 border border-stone-300 dark:border-stone-800 space-y-6 text-left">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
              Objectives Completed
            </span>
            <div className="text-2xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span>{quest.objectives.length} / {quest.objectives.length}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
              Earned Rewards
            </span>
            <div className="text-2xl font-black text-amber-500 flex items-center justify-end gap-1.5 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>+{quest.totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* Poetic Naturalist Reflection */}
        <div className="space-y-2 text-center py-2">
          <p className="text-lg font-bold text-stone-800 dark:text-stone-200">
            You explored.
          </p>
          <p className="text-lg font-bold text-emerald-800 dark:text-emerald-400">
            You observed.
          </p>
          <p className="text-lg font-bold text-stone-800 dark:text-stone-200">
            You discovered something new.
          </p>
        </div>

        {/* Progress Summary Pill */}
        <div className="p-4 bg-stone-100 dark:bg-stone-800/80 rounded-2xl flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <TreePine className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">Naturalist Level {userLevel}</span>
          </div>
          <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
            Total XP: {totalXp}
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 rounded-2xl text-sm font-bold animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Action CTAs */}
      <div className="space-y-3 pt-2">
        {!isSavedToJournal ? (
          <button
            type="button"
            onClick={handleSaveToNatureJournal}
            className="w-full py-4 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookmarkCheck className="w-5 h-5 text-emerald-300" />
            <span>Save to Nature Journal</span>
          </button>
        ) : (
          <Link
            href="/journal"
            className="w-full py-4 px-6 bg-emerald-800/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 transition hover:bg-emerald-800/30"
          >
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>View Nature Journal ({quest.objectives.length} Discoveries Logged)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        <button
          type="button"
          onClick={handleStartAnother}
          className="w-full py-3.5 px-6 bg-stone-200/80 dark:bg-stone-800/80 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm sm:text-base rounded-2xl transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Start Another Quest</span>
        </button>
      </div>
    </div>
  );
}
