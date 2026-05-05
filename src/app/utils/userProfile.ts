export interface UserProfile {
  points: number;
  streak: number;
  lastWakeUp: string | null; // ISO date string
  totalWakeUps: number;
  totalMisses: number;
  streakBonuses: {
    day3: number; // how many times got 3-day bonus
    day7: number; // how many times got 7-day bonus
  };
}

const STORAGE_KEY = 'nooze_user_profile';

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return getDefaultProfile();
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaultProfile = getDefaultProfile();
    saveUserProfile(defaultProfile);
    return defaultProfile;
  }
  return JSON.parse(stored);
}

function getDefaultProfile(): UserProfile {
  return {
    points: 135,
    streak: 7,
    lastWakeUp: new Date().toISOString(),
    totalWakeUps: 14,
    totalMisses: 2,
    streakBonuses: {
      day3: 2,
      day7: 1,
    },
  };
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function recordWakeUpSuccess(): UserProfile {
  const profile = getUserProfile();

  // Base points for waking up
  profile.points += 10;
  profile.streak += 1;
  profile.totalWakeUps += 1;
  profile.lastWakeUp = new Date().toISOString();

  // Streak bonuses
  if (profile.streak % 7 === 0) {
    profile.points += 15;
    profile.streakBonuses.day7 += 1;
  } else if (profile.streak % 3 === 0) {
    profile.points += 5;
    profile.streakBonuses.day3 += 1;
  }

  saveUserProfile(profile);
  return profile;
}

export function recordWakeUpFailure(): UserProfile {
  const profile = getUserProfile();

  // Penalty
  profile.points = Math.max(0, profile.points - 15);
  profile.streak = 0;
  profile.totalMisses += 1;

  saveUserProfile(profile);
  return profile;
}

export function updatePoints(points: number): void {
  const profile = getUserProfile();
  profile.points = Math.max(0, points);
  saveUserProfile(profile);
}

export function resetProfile(): void {
  const defaultProfile = getDefaultProfile();
  saveUserProfile(defaultProfile);
}
