'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Camera,
  Volume2,
  FileText,
  Trash2,
  Calendar,
  Compass,
  MapPin,
  Sparkles,
  Award,
  Filter,
} from 'lucide-react';
import { getJournalEntries, deleteJournalEntry, clearJournal } from '../../lib/storage/journal';
import { JournalEntry } from '../../lib/types/quest';

export default function NatureJournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    setEntries(getJournalEntries());
    setDeleteConfirmId(null);
  };

  const filteredEntries = entries.filter((entry) => {
    if (selectedFilter === 'all') return true;
    return entry.evidenceType === selectedFilter;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2 sm:py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <BookOpen className="w-4 h-4" />
            <span>Field Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-stone-100">
            My Nature Journal
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
            {entries.length} {entries.length === 1 ? 'DISCOVERY' : 'DISCOVERIES'} LOGGED
          </p>
        </div>

        {/* Filter Badges */}
        {entries.length > 0 && (
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 dark:bg-stone-800/80 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedFilter === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('photo')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                selectedFilter === 'photo'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photos</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('audio')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                selectedFilter === 'audio'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Acoustic</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('text')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                selectedFilter === 'text'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {entries.length === 0 ? (
        <div className="field-journal-card rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-stone-300 dark:border-stone-800">
          <div className="w-20 h-20 rounded-full bg-emerald-950/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Your field journal is waiting
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Complete your first outdoor quest and return to save verified leaf shapes, bird calls, and living observations.
            </p>
          </div>
          <Link
            href="/quest/new"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-sm shadow-md transition"
          >
            <Compass className="w-4 h-4" />
            <span>Start Your First Quest</span>
          </Link>
        </div>
      ) : (
        /* Journal Entries Grid / Stream */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="field-journal-card rounded-3xl p-5 sm:p-6 border border-stone-300 dark:border-stone-800 space-y-4 flex flex-col justify-between hover:border-emerald-600/40 transition"
            >
              {/* Card Photo (if any) */}
              {entry.photoData && entry.photoData.startsWith('data:image') && (
                <div className="w-full h-48 rounded-2xl overflow-hidden bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.photoData}
                    alt={entry.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-3 flex-1">
                {/* Header Tag & XP */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 px-2 py-0.5 bg-emerald-900/10 dark:bg-emerald-400/10 rounded-md">
                    {entry.category || 'Field Note'}
                  </span>
                  <span className="text-xs font-black text-amber-500">
                    +{entry.xp} XP
                  </span>
                </div>

                {/* Discovery Title */}
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tight">
                  {entry.title}
                </h3>

                {/* Quest Context */}
                <div className="text-xs text-stone-500 dark:text-stone-400 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Discovered during: <strong>{entry.questTitle}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{entry.date}</span>
                  </div>
                </div>

                {/* Observation Quote */}
                <div className="p-3.5 bg-stone-100 dark:bg-stone-900/70 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-200 italic leading-relaxed">
                  &ldquo;{entry.observation}&rdquo;
                </div>
              </div>

              {/* Card Footer: Location & Delete */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{entry.location || 'Local Trail Route'}</span>
                </div>

                {deleteConfirmId === entry.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-red-500">Delete?</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-xs text-stone-400 hover:text-stone-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(entry.id)}
                    className="text-stone-400 hover:text-red-500 transition p-1"
                    title="Delete discovery"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
