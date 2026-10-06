'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookOpen, Trophy, Settings, PlusCircle, Trees } from 'lucide-react';
import DemoAIBadge from './DemoAIBadge';
import NetworkStatus from './NetworkStatus';
import { getActiveQuestSession } from '../lib/storage/session';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [hasActiveSession, setHasActiveSession] = useState<boolean>(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session = getActiveQuestSession();
    if (session && (session.status === 'active' || session.status === 'briefing')) {
      setHasActiveSession(true);
      setActiveSessionId(session.quest.id);
    } else {
      setHasActiveSession(false);
      setActiveSessionId(null);
    }
  }, [pathname]);

  // If in pure phone-away fullscreen mode, keep minimal distraction
  const isPhoneAwayScreen = pathname.includes('/active');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-stone-100/90 dark:bg-stone-950/85 border-b border-stone-300/80 dark:border-stone-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-hidden focus:ring-2 focus:ring-emerald-500 rounded-lg p-1 -ml-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-950 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Trees className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-stone-100 block leading-none">
              AI Nature Quest
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase block mt-0.5">
              Touch Grass Edition
            </span>
          </div>
        </Link>

        {/* Center Desktop Links */}
        {!isPhoneAwayScreen && (
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-stone-700 dark:text-stone-300">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'bg-emerald-800/10 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              Home
            </Link>
            <Link
              href="/quest/new"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                pathname.startsWith('/quest')
                  ? 'bg-emerald-800/10 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Start Quest</span>
            </Link>
            <Link
              href="/journal"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                pathname.startsWith('/journal')
                  ? 'bg-emerald-800/10 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Journal</span>
            </Link>
            <Link
              href="/progress"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                pathname.startsWith('/progress')
                  ? 'bg-emerald-800/10 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Progress</span>
            </Link>
            <Link
              href="/settings"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                pathname.startsWith('/settings')
                  ? 'bg-emerald-800/10 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>
        )}

        {/* Active Quest Quick Indicator & Right Badges */}
        <div className="flex items-center gap-2">
          {hasActiveSession && !isPhoneAwayScreen && (
            <Link
              href={activeSessionId ? `/quest/${activeSessionId}/active` : '/quest/new'}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-full shadow-xs animate-pulse transition"
            >
              <span className="w-2 h-2 rounded-full bg-stone-950" />
              <span>Resume Quest</span>
            </Link>
          )}

          <DemoAIBadge />
          <NetworkStatus />
        </div>
      </div>
    </header>
  );
}
