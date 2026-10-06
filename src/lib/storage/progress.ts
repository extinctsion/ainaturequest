import { UserProgress, Badge } from '../types/quest';

const PROGRESS_STORAGE_KEY = 'ai_nature_quest_user_progress_v1';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first-quest',
    title: 'First Step Outside',
    description: 'Completed your very first AI Nature Quest.',
    icon: '🌱',
  },
  {
    id: 'phone-away-master',
    title: 'Screen Free Explorer',
    description: 'Spent 30+ minutes in Phone Away Mode without early cancellation.',
    icon: '📵',
  },
  {
    id: 'leaf-detective',
    title: 'Botanist Eyes',
    description: 'Submitted verified photographic leaf or flora evidence.',
    icon: '🍃',
  },
  {
    id: 'acoustic-seeker',
    title: 'Soundscape Listener',
    description: 'Captured and identified ambient natural bio-phony.',
    icon: '🦉',
  },
  {
    id: 'deep-observer',
    title: 'Field Chronicler',
    description: 'Saved 5 or more nature discoveries into your Nature Journal.',
    icon: '📖',
  },
  {
    id: 'veteran-naturalist',
    title: 'Veteran Naturalist',
    description: 'Reached Level 3 and earned over 700 total XP outdoors.',
    icon: '⭐',
  }
];

export function calculateLevel(totalXp: number): { level: number; currentXp: number; nextLevelXp: number } {
  // Deterministic level brackets:
  // Level 1: 0 - 250 XP
  // Level 2: 250 - 600 XP (needs 350)
  // Level 3: 600 - 1100 XP (needs 500)
  // Level 4: 1100 - 1800 XP (needs 700)
  // Level 5: 1800 - 2700 XP (needs 900)
  // Level N: + 200*(N-1) per bracket
  const brackets = [0, 250, 600, 1100, 1800, 2700, 3800, 5100, 6600, 8500];

  let level = 1;
  for (let i = 0; i < brackets.length - 1; i++) {
    if (totalXp >= brackets[i + 1]) {
      level = i + 2;
    } else {
      break;
    }
  }

  const currentLevelThreshold = brackets[level - 1] || 0;
  const nextLevelThreshold = brackets[level] || currentLevelThreshold + 1000;
  const currentXp = totalXp - currentLevelThreshold;
  const nextLevelXp = nextLevelThreshold - currentLevelThreshold;

  return { level, currentXp, nextLevelXp };
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return {
      level: 1,
      currentXp: 0,
      nextLevelXp: 250,
      totalXp: 0,
      totalQuestsCompleted: 0,
      totalDiscoveries: 0,
      longestQuestMinutes: 0,
      totalMinutesOutdoors: 0,
      completedQuestIds: [],
      badges: INITIAL_BADGES,
    };
  }

  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      const defaultProgress: UserProgress = {
        level: 1,
        currentXp: 0,
        nextLevelXp: 250,
        totalXp: 0,
        totalQuestsCompleted: 0,
        totalDiscoveries: 0,
        longestQuestMinutes: 0,
        totalMinutesOutdoors: 0,
        completedQuestIds: [],
        badges: INITIAL_BADGES,
      };
      saveProgress(defaultProgress);
      return defaultProgress;
    }
    return JSON.parse(raw) as UserProgress;
  } catch (err) {
    console.error('Failed to load user progress:', err);
    return {
      level: 1,
      currentXp: 0,
      nextLevelXp: 250,
      totalXp: 0,
      totalQuestsCompleted: 0,
      totalDiscoveries: 0,
      longestQuestMinutes: 0,
      totalMinutesOutdoors: 0,
      completedQuestIds: [],
      badges: INITIAL_BADGES,
    };
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress:', err);
  }
}

export function addXpAndQuestCompletion(
  questId: string,
  earnedXp: number,
  questMinutes: number,
  discoveriesCount: number = 0
): UserProgress {
  const current = getProgress();
  const newTotalXp = current.totalXp + earnedXp;
  const { level, currentXp, nextLevelXp } = calculateLevel(newTotalXp);

  const updatedBadges = current.badges.map((b) => {
    if (b.unlockedAt) return b;
    // Badge unlocking rules
    if (b.id === 'first-quest') {
      return { ...b, unlockedAt: Date.now() };
    }
    if (b.id === 'phone-away-master' && questMinutes >= 30) {
      return { ...b, unlockedAt: Date.now() };
    }
    if (b.id === 'veteran-naturalist' && newTotalXp >= 700) {
      return { ...b, unlockedAt: Date.now() };
    }
    return b;
  });

  const updated: UserProgress = {
    ...current,
    totalXp: newTotalXp,
    level,
    currentXp,
    nextLevelXp,
    totalQuestsCompleted: current.totalQuestsCompleted + 1,
    totalDiscoveries: current.totalDiscoveries + discoveriesCount,
    longestQuestMinutes: Math.max(current.longestQuestMinutes, questMinutes),
    totalMinutesOutdoors: current.totalMinutesOutdoors + questMinutes,
    completedQuestIds: current.completedQuestIds.includes(questId)
      ? current.completedQuestIds
      : [...current.completedQuestIds, questId],
    badges: updatedBadges,
  };

  saveProgress(updated);
  return updated;
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROGRESS_STORAGE_KEY);
}
