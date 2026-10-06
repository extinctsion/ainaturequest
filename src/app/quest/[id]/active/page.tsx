'use client';

import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Smartphone,
  CheckCircle2,
  TreePine,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldAlert,
  Footprints,
} from 'lucide-react';
import {
  getActiveQuestSession,
  saveActiveQuestSession,
  updateSessionStatus,
} from '../../../../lib/storage/session';
import { DEMO_QUEST_DATABASE } from '../../../../lib/ai/demo-provider';
import { Quest, QuestSession } from '../../../../lib/types/quest';

export default function PhoneAwayActivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [session, setSession] = useState<QuestSession | null>(null);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [timerCompleted, setTimerCompleted] = useState<boolean>(false);
  const [chimePlayed, setChimePlayed] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Play gentle web audio chime
  const playChime = () => {
    if (soundMuted) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.4); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.8); // G5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // AudioContext might be blocked until interaction
    }
  };

  useEffect(() => {
    // 1. Load active quest session
    let currentSession = getActiveQuestSession();

    if (!currentSession || currentSession.quest.id !== resolvedParams.id) {
      const fallbackQuest =
        DEMO_QUEST_DATABASE.find((q) => q.id === resolvedParams.id) ||
        DEMO_QUEST_DATABASE[0];

      const now = Date.now();
      const durationMs = fallbackQuest.phoneAwayMinutes * 60 * 1000;
      currentSession = {
        id: `session_${Date.now()}_${fallbackQuest.id}`,
        quest: fallbackQuest,
        startTime: now,
        targetEndTime: now + durationMs,
        status: 'active',
        elapsedSeconds: 0,
        submittedEvidence: {},
        evaluations: {},
        totalXpEarned: 0,
      };
      saveActiveQuestSession(currentSession);
    }

    setSession(currentSession);
    setQuest(currentSession.quest);

    // 2. Check if timer was already started
    const now = Date.now();
    if (currentSession.targetEndTime && currentSession.targetEndTime > now) {
      const remaining = Math.max(0, Math.floor((currentSession.targetEndTime - now) / 1000));
      setRemainingSeconds(remaining);
      setTimerRunning(true);
    } else if (currentSession.status === 'review' || (currentSession.targetEndTime && currentSession.targetEndTime <= now)) {
      setRemainingSeconds(0);
      setTimerCompleted(true);
    } else {
      // Initial state: timer not yet started
      setRemainingSeconds((currentSession.quest.phoneAwayMinutes || 25) * 60);
      setTimerRunning(false);
    }
  }, [resolvedParams.id]);

  // Main countdown timer interval
  useEffect(() => {
    if (!timerRunning || timerCompleted || !session) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((session.targetEndTime - now) / 1000);

      if (diff <= 0) {
        setRemainingSeconds(0);
        setTimerRunning(false);
        setTimerCompleted(true);
        updateSessionStatus('review');

        if (!chimePlayed) {
          playChime();
          setChimePlayed(true);
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
        }
      } else {
        setRemainingSeconds(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timerCompleted, session, chimePlayed, soundMuted]);

  const handleStartTimer = () => {
    if (!session || !quest) return;
    const now = Date.now();
    const durationMs = (quest.phoneAwayMinutes || quest.durationMinutes) * 60 * 1000;
    const targetEnd = now + durationMs;

    const updated: QuestSession = {
      ...session,
      startTime: now,
      targetEndTime: targetEnd,
      status: 'active',
    };

    saveActiveQuestSession(updated);
    setSession(updated);
    setRemainingSeconds((quest.phoneAwayMinutes || quest.durationMinutes) * 60);
    setTimerRunning(true);
    setTimerCompleted(false);
  };

  const handleProceedToEvidence = () => {
    if (!quest) return;
    updateSessionStatus('review');
    router.push(`/quest/${quest.id}/evidence`);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quest) {
    return null;
  }

  // SCREEN 3: Timer Finished / Welcome Back
  if (timerCompleted) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto py-8 animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            EXPEDITION COMPLETE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50">
            Welcome back.
          </h1>
          <p className="text-lg font-medium text-stone-700 dark:text-stone-300">
            Did you discover something?
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
            Review your field objectives and submit your photo, audio, or text evidence for AI naturalist evaluation.
          </p>
        </div>

        <div className="w-full pt-4 space-y-3">
          <button
            type="button"
            onClick={handleProceedToEvidence}
            className="w-full py-4 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Submit Evidence</span>
            <ArrowRight className="w-5 h-5 text-emerald-300" />
          </button>
        </div>
      </div>
    );
  }

  // SCREEN 2: Active Phone-Away Mode (Minimalist, Screen Discouraging)
  if (timerRunning) {
    return (
      <div className="fixed inset-0 z-50 bg-[#07130b] text-[#edf4ee] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden animate-in fade-in duration-500">
        {/* Top minimal status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-black uppercase tracking-widest">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>🌿 QUEST ACTIVE</span>
          </div>

          <button
            type="button"
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 text-emerald-400/60 hover:text-emerald-400 rounded-lg"
            aria-label="Toggle completion sound"
          >
            {soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Center: Huge countdown & Clear Phone-Away Directive */}
        <div className="flex flex-col items-center justify-center text-center my-auto space-y-8">
          <div className="relative flex items-center justify-center">
            {/* Ambient breathing aura ring */}
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-emerald-500/20 animate-breathe flex items-center justify-center" />
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
              <div className="font-mono text-6xl sm:text-8xl font-black tracking-tight text-white drop-shadow-md">
                {formatTime(remainingSeconds)}
              </div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400/80">
                Time Remaining Outdoors
              </span>
            </div>
          </div>

          <div className="space-y-3 max-w-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-100 tracking-tight">
              Put your phone away.
            </p>
            <p className="text-xs sm:text-sm text-emerald-400/70 leading-relaxed">
              Step into the air, observe the living details, and return when your timer chimes.
            </p>
          </div>
        </div>

        {/* Bottom: Subtle exit / Early return button */}
        <div className="flex flex-col items-center space-y-4">
          <button
            type="button"
            onClick={handleProceedToEvidence}
            className="text-xs font-semibold text-emerald-400/60 hover:text-emerald-300 underline underline-offset-4 transition py-2 px-4"
          >
            I&apos;m finished early (Submit Evidence)
          </button>
          <div className="text-[10px] text-emerald-600 uppercase tracking-widest">
            {quest.title} · {quest.objectives.length} Objectives
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 1: Pre-Timer Briefing ("QUEST STARTED")
  return (
    <div className="max-w-lg mx-auto py-6 sm:py-10 space-y-8 text-center animate-in fade-in duration-300">
      <div className="w-20 h-20 rounded-full bg-emerald-900/10 dark:bg-emerald-400/10 border-2 border-emerald-600/30 flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-400">
        <Smartphone className="w-10 h-10 animate-pulse-gentle" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
          STAGE 02 · SCREEN DISCONNECT
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
          QUEST STARTED
        </h1>
      </div>

      <div className="field-journal-card rounded-3xl p-6 sm:p-8 border border-stone-300 dark:border-stone-800 space-y-4 text-left">
        <div className="space-y-3 text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-medium">
          <p className="font-bold text-stone-900 dark:text-stone-100 text-lg">
            Your phone is no longer needed.
          </p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-300 pl-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Put it away in your pocket or bag.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Go explore and complete your objectives.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Come back when you&apos;re ready to record findings.</span>
            </li>
          </ul>
        </div>

        <div className="p-3 bg-stone-100 dark:bg-stone-800/80 rounded-xl text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
          <Footprints className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Timer will run in the background ({quest.phoneAwayMinutes} minutes).</span>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={handleStartTimer}
          className="w-full py-4 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <TreePine className="w-5 h-5 text-emerald-300" />
          <span>Start Phone-Away Timer</span>
        </button>
      </div>
    </div>
  );
}
