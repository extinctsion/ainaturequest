'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, BookOpen, Trophy, Settings } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Completely hide navigation during Phone Away Mode to eliminate screen distraction
  if (pathname.includes('/active')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home, exact: true },
    { label: 'Quest', href: '/quest/new', icon: Compass, exact: false },
    { label: 'Journal', href: '/journal', icon: BookOpen, exact: false },
    { label: 'Progress', href: '/progress', icon: Trophy, exact: false },
    { label: 'Settings', href: '/settings', icon: Settings, exact: false },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-100/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-300 dark:border-stone-800 pb-safe">
      <nav className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-emerald-600/15' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
