import { Quest } from '../types/quest';

const QUEST_HISTORY_KEY = 'ai_nature_quest_history_v1';

export interface CompletedQuestRecord {
  id: string;
  quest: Quest;
  completedAt: number;
  xpEarned: number;
  durationMinutes: number;
  objectivesCompletedCount: number;
}

export function getQuestHistory(): CompletedQuestRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEST_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CompletedQuestRecord[];
  } catch (err) {
    console.error('Failed to load quest history:', err);
    return [];
  }
}

export function saveCompletedQuestRecord(record: CompletedQuestRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getQuestHistory();
    const updated = [record, ...history.filter((h) => h.id !== record.id)];
    localStorage.setItem(QUEST_HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save completed quest record:', err);
  }
}

export function clearQuestHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(QUEST_HISTORY_KEY);
}
