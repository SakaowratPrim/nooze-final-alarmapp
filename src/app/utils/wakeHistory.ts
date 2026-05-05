export interface WakeHistoryEntry {
  date: string; // ISO date string
  success: boolean;
  pointsEarned: number; // can be negative
  streakAtTime: number;
  bonusEarned?: number;
  note?: string; // User's note about this day
  alarmTime?: string; // The alarm time set by user (e.g., "7:30 AM")
}

const STORAGE_KEY = 'nooze_wake_history';

export function getWakeHistory(): WakeHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function saveWakeHistory(history: WakeHistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function addWakeHistoryEntry(entry: WakeHistoryEntry): void {
  const history = getWakeHistory();
  history.unshift(entry); // Add to beginning

  // Keep only last 30 days
  if (history.length > 30) {
    history.splice(30);
  }

  saveWakeHistory(history);
}

export function getRecentHistory(days: number = 7): WakeHistoryEntry[] {
  const history = getWakeHistory();
  return history.slice(0, days);
}

export function getSuccessRate(): number {
  const history = getWakeHistory();
  if (history.length === 0) return 0;

  const successful = history.filter(h => h.success).length;
  return Math.round((successful / history.length) * 100);
}

export function updateEntryNote(date: string, note: string): void {
  const history = getWakeHistory();
  const entry = history.find(h => {
    const entryDate = new Date(h.date);
    const targetDate = new Date(date);
    return (
      entryDate.getDate() === targetDate.getDate() &&
      entryDate.getMonth() === targetDate.getMonth() &&
      entryDate.getFullYear() === targetDate.getFullYear()
    );
  });

  if (entry) {
    entry.note = note;
    saveWakeHistory(history);
  }
}
