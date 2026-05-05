export interface Buddy {
  name: string;
  awake: boolean;
  streak: number;
  addedDate: string; // ISO date when buddy was added
}

const STORAGE_KEY = 'nooze_buddies';

export function getBuddies(): Buddy[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Default buddies (added yesterday so they show status)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const defaultBuddies: Buddy[] = [
      { name: "Alice", awake: true, streak: 8, addedDate: yesterday.toISOString() },
      { name: "Bob", awake: true, streak: 5, addedDate: yesterday.toISOString() },
      { name: "Charlie", awake: false, streak: 0, addedDate: yesterday.toISOString() },
      { name: "Diana", awake: true, streak: 12, addedDate: yesterday.toISOString() },
    ];
    saveBuddies(defaultBuddies);
    return defaultBuddies;
  }
  return JSON.parse(stored);
}

export function saveBuddies(buddies: Buddy[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(buddies));
}

export const MAX_BUDDIES = 5;

export function canAddMoreBuddies(): boolean {
  const buddies = getBuddies();
  return buddies.length < MAX_BUDDIES;
}

export function getBuddyCount(): { current: number; max: number } {
  return {
    current: getBuddies().length,
    max: MAX_BUDDIES,
  };
}

export function addBuddy(username: string): boolean {
  const buddies = getBuddies();

  // Check if buddy limit reached
  if (buddies.length >= MAX_BUDDIES) {
    return false;
  }

  // Check if buddy already exists
  if (buddies.some(b => b.name.toLowerCase() === username.toLowerCase())) {
    return false;
  }

  // Add new buddy (added today, so won't show status yet)
  const newBuddy: Buddy = {
    name: username,
    awake: false, // Default to false, status will show from tomorrow
    streak: 0, // New buddy starts with 0 streak
    addedDate: new Date().toISOString(),
  };

  buddies.push(newBuddy);
  saveBuddies(buddies);
  return true;
}

export function updateBuddyStatus(name: string, awake: boolean, streak: number): void {
  const buddies = getBuddies();
  const buddy = buddies.find(b => b.name === name);
  if (buddy) {
    buddy.awake = awake;
    buddy.streak = streak;
    saveBuddies(buddies);
  }
}

export function removeBuddy(name: string): boolean {
  const buddies = getBuddies();
  const filteredBuddies = buddies.filter(b => b.name !== name);

  if (filteredBuddies.length === buddies.length) {
    return false; // Buddy not found
  }

  saveBuddies(filteredBuddies);
  return true;
}

export function isNewBuddy(buddy: Buddy): boolean {
  // Check if buddy was added today
  const addedDate = new Date(buddy.addedDate);
  const today = new Date();
  return (
    addedDate.getDate() === today.getDate() &&
    addedDate.getMonth() === today.getMonth() &&
    addedDate.getFullYear() === today.getFullYear()
  );
}
