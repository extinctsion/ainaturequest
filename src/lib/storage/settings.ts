import { AppSettings } from '../types/quest';
import { clearActiveQuestSession } from './session';
import { clearQuestHistory } from './quests';
import { clearJournal } from './journal';
import { resetProgress } from './progress';

const SETTINGS_KEY = 'ai_nature_quest_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  aiProvider: 'demo',
  soundEnabled: true,
  hapticsEnabled: true,
  highContrast: false,
  offlineMode: false,
};

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load settings:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save settings:', err);
    return DEFAULT_SETTINGS;
  }
}

export function resetAllData(): void {
  clearActiveQuestSession();
  clearQuestHistory();
  clearJournal();
  resetProgress();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SETTINGS_KEY);
  }
}
