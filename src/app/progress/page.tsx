'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Award,
  Sparkles,
  TreePine,
  Clock,
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { getProgress } from '../../lib/storage/progress';
import { getQuestHistory, CompletedQuestRecord } from '../../lib/storage/quests';
import { UserProgress } from '../../lib/types/quest';

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [history, setHistory] = useState<CompletedQuestRecord[]>([]);

  useEffect(() => {
    setProgress(getProgress());
    setHistory(getQuestHistory());
  }, []);

  if (!progress) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Trophy className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold">Loading naturalist progress...</p>
        </div>
      </div>
    );
  }

  const xpProgressPercent = Math.min(
    100,
    Math.max(0, (progress.currentXp / Math.max(1, progress.nextLevelXp)) * 100)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2 sm:py-4">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <Trophy className="w-4 h-4" />
          <span>Naturalist Records</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-stone-100">
          Your Journey
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
          FIELD RANK & ACCOMPLISHMENTS
        </p>
      </div>

      {/* Main Level & XP Card */}
      <div className="field-journal-card rounded-3xl p-6 sm:p-8 border border-stone-300 dark:border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              NATURE EXPLORER
            </span>
            <div className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100">
              Level {progress.level}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-black text-amber-500 flex items-center sm:justify-end gap-1.5">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span>{progress.totalXp} XP</span>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
              Lifetime Earned XP
            </span>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-300">
            <span>Progress to Level {progress.level + 1}</span>
            <span>
              {progress.currentXp} / {progress.nextLevelXp} XP
            </span>
          </div>
          <div className="w-full h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-300/50 dark:border-stone-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Real Application Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
          <div className="p-3.5 bg-stone-100 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Quests
            </span>
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              {progress.totalQuestsCompleted}
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              Completed
            </span>
          </div>

          <div className="p-3.5 bg-stone-100 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Discoveries
            </span>
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              {progress.totalDiscoveries}
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              In Journal
            </span>
          </div>

          <div className="p-3.5 bg-stone-100 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Longest Quest
            </span>
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              {progress.longestQuestMinutes}m
            </div>
            <span className="text-[11px] text-stone-500 font-semibold">
              Field Time
            </span>
          </div>

          <div className="p-3.5 bg-stone-100 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Time Outdoors
            </span>
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              {progress.totalMinutesOutdoors}m
            </div>
            <span className="text-[11px] text-stone-500 font-semibold">
              Logged
            </span>
          </div>
        </div>
      </div>

      {/* Field Badges Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-widest text-stone-500 dark:text-stone-400">
            FIELD BADGES ({progress.badges.filter((b) => b.unlockedAt).length} / {progress.badges.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {progress.badges.map((badge) => {
            const isUnlocked = !!badge.unlockedAt;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-emerald-900/10 dark:bg-emerald-950/30 border-emerald-500/40 text-stone-900 dark:text-stone-100'
                    : 'bg-stone-100/70 dark:bg-stone-900/40 border-stone-300 dark:border-stone-800 text-stone-400 opacity-65'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{badge.icon}</span>
                  {isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-600 text-white">
                      Unlocked
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                  )}
                </div>
                <h3 className="font-bold text-sm leading-tight">{badge.title}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Completed Quests History Log */}
      {history.length > 0 && (
        <section className="space-y-4 pt-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-stone-500 dark:text-stone-400">
            EXPEDITION HISTORY ({history.length})
          </h2>

          <div className="space-y-2.5">
            {history.map((record) => (
              <div
                key={record.id}
                className="field-journal-card rounded-2xl p-4 border border-stone-300 dark:border-stone-800 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {record.quest.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {record.durationMinutes} min
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {record.objectivesCompletedCount} objectives
                    </span>
                  </div>
                </div>

                <div className="text-xs font-black text-amber-500">
                  +{record.xpEarned} XP
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Footer */}
      <div className="pt-4 text-center">
        <Link
          href="/quest/new"
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-base rounded-2xl shadow-lg transition"
        >
          <Compass className="w-5 h-5 text-emerald-300" />
          <span>Launch Next Quest</span>
        </Link>
      </div>
    </div>
  );
}
