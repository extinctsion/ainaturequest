import { JournalEntry } from '../types/quest';

const JOURNAL_STORAGE_KEY = 'ai_nature_quest_journal_entries_v1';

export function getJournalEntries(): JournalEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) return [];
    const entries = JSON.parse(raw) as JournalEntry[];
    return entries.sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.error('Failed to load journal entries from localStorage:', err);
    return [];
  }
}

export function saveJournalEntry(entry: JournalEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getJournalEntries();
    // Avoid duplicate id
    const filtered = current.filter((e) => e.id !== entry.id);
    const updated = [entry, ...filtered];
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save journal entry to localStorage:', err);
  }
}

export function saveMultipleJournalEntries(entries: JournalEntry[]): void {
  if (typeof window === 'undefined' || !entries.length) return;
  try {
    const current = getJournalEntries();
    const entryIds = new Set(entries.map((e) => e.id));
    const filtered = current.filter((e) => !entryIds.has(e.id));
    const updated = [...entries, ...filtered].sort((a, b) => b.timestamp - a.timestamp);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save journal entries:', err);
  }
}

export function deleteJournalEntry(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getJournalEntries();
    const updated = current.filter((e) => e.id !== id);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete journal entry:', err);
  }
}

export function clearJournal(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(JOURNAL_STORAGE_KEY);
}
