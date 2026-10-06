export type AdventureType =
  | 'nature'
  | 'wildlife'
  | 'photography'
  | 'exploration'
  | 'mindfulness'
  | 'mystery'
  | 'surprise';

export type DifficultyLevel = 'easy' | 'moderate' | 'challenging';

export type EvidenceType = 'photo' | 'audio' | 'text' | 'any';

export interface QuestObjective {
  id: string;
  title: string;
  description: string;
  evidenceType: EvidenceType;
  xp: number;
  hint?: string;
  promptGuidance?: string;
}

export interface Quest {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  durationMinutes: number;
  difficulty: number; // 1 to 5
  difficultyLabel?: DifficultyLevel;
  category: AdventureType;
  objectives: QuestObjective[];
  totalXp: number;
  phoneAwayMinutes: number;
  safetyTip?: string;
}

export interface QuestRequest {
  durationMinutes: number;
  adventureType: AdventureType | string;
  difficulty: DifficultyLevel;
  userLevel?: number;
  environmentHint?: 'park' | 'urban' | 'forest' | 'neighborhood' | 'any';
}

export interface Evidence {
  objectiveId: string;
  type: EvidenceType;
  data: string; // Base64 image, audio snippet text/data, or text content
  fileName?: string;
  note?: string;
  timestamp: number;
  location?: string;
}

export interface EvidenceRequest {
  questId: string;
  objective: QuestObjective;
  evidence: Evidence;
}

export interface EvidenceResult {
  objectiveId: string;
  completed: boolean;
  confidence: number; // e.g. 0.91 -> 91%
  feedback: string;
  xpAwarded: number;
  naturalistInsight?: string;
}

export type QuestSessionStatus =
  | 'briefing'
  | 'active'
  | 'review'
  | 'completed'
  | 'abandoned';

export interface QuestSession {
  id: string;
  quest: Quest;
  startTime: number;
  targetEndTime: number;
  status: QuestSessionStatus;
  elapsedSeconds: number;
  submittedEvidence: Record<string, Evidence>;
  evaluations: Record<string, EvidenceResult>;
  totalXpEarned: number;
  completedAt?: number;
  savedToJournal?: boolean;
}

export interface JournalEntry {
  id: string;
  questId: string;
  questTitle: string;
  title: string;
  observation: string;
  photoData?: string;
  audioNote?: string;
  evidenceType: EvidenceType;
  date: string;
  timestamp: number;
  xp: number;
  category: string;
  location?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface UserProgress {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  totalXp: number;
  totalQuestsCompleted: number;
  totalDiscoveries: number;
  longestQuestMinutes: number;
  totalMinutesOutdoors: number;
  completedQuestIds: string[];
  badges: Badge[];
}

export interface AppSettings {
  aiProvider: 'demo' | 'gemma' | 'custom';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  highContrast: boolean;
  offlineMode: boolean;
}
