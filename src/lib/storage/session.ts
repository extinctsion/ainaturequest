import { Quest, QuestSession, Evidence, EvidenceResult } from '../types/quest';

const SESSION_STORAGE_KEY = 'ai_nature_quest_active_session_v1';

export function getActiveQuestSession(): QuestSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuestSession;
  } catch (err) {
    console.error('Failed to parse active quest session from localStorage:', err);
    return null;
  }
}

export function saveActiveQuestSession(session: QuestSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save active quest session to localStorage:', err);
  }
}

export function createQuestSession(quest: Quest): QuestSession {
  const now = Date.now();
  const phoneAwayMs = (quest.phoneAwayMinutes || quest.durationMinutes) * 60 * 1000;
  
  const newSession: QuestSession = {
    id: `session_${Date.now()}_${quest.id}`,
    quest,
    startTime: now,
    targetEndTime: now + phoneAwayMs,
    status: 'briefing',
    elapsedSeconds: 0,
    submittedEvidence: {},
    evaluations: {},
    totalXpEarned: 0,
  };

  saveActiveQuestSession(newSession);
  return newSession;
}

export function updateSessionStatus(
  status: QuestSession['status'],
  additionalData?: Partial<QuestSession>
): QuestSession | null {
  const current = getActiveQuestSession();
  if (!current) return null;

  const updated: QuestSession = {
    ...current,
    status,
    ...additionalData,
  };

  saveActiveQuestSession(updated);
  return updated;
}

export function saveEvidenceToSession(
  objectiveId: string,
  evidence: Evidence,
  evaluation?: EvidenceResult
): QuestSession | null {
  const current = getActiveQuestSession();
  if (!current) return null;

  const updated: QuestSession = {
    ...current,
    submittedEvidence: {
      ...current.submittedEvidence,
      [objectiveId]: evidence,
    },
    evaluations: evaluation
      ? {
          ...current.evaluations,
          [objectiveId]: evaluation,
        }
      : current.evaluations,
  };

  saveActiveQuestSession(updated);
  return updated;
}

export function clearActiveQuestSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear active quest session:', err);
  }
}
