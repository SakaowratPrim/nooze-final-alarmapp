export interface AlarmSound {
  id: string;
  name: string;
  category: 'gentle' | 'energetic' | 'nature' | 'classic';
  audioUrl?: string; // In a real app, this would be actual audio file URLs
}

export const alarmSounds: AlarmSound[] = [
  { id: 'gentle-1', name: 'Soft Piano', category: 'gentle' },
  { id: 'gentle-2', name: 'Morning Breeze', category: 'gentle' },
  { id: 'gentle-3', name: 'Peaceful Bells', category: 'gentle' },
  { id: 'energetic-1', name: 'Upbeat Pop', category: 'energetic' },
  { id: 'energetic-2', name: 'Electronic Beat', category: 'energetic' },
  { id: 'energetic-3', name: 'Rock Anthem', category: 'energetic' },
  { id: 'nature-1', name: 'Birds Chirping', category: 'nature' },
  { id: 'nature-2', name: 'Ocean Waves', category: 'nature' },
  { id: 'nature-3', name: 'Rain Forest', category: 'nature' },
  { id: 'classic-1', name: 'Classic Alarm', category: 'classic' },
  { id: 'classic-2', name: 'Digital Beep', category: 'classic' },
  { id: 'classic-3', name: 'Rooster Call', category: 'classic' },
];

const STORAGE_KEY = 'nooze_alarm_sound';

export interface AlarmSoundSettings {
  mode: 'random' | 'custom';
  selectedSound: AlarmSound | null;
}

export function getAlarmSettings(): AlarmSoundSettings {
  if (typeof window === 'undefined') {
    return { mode: 'random', selectedSound: null };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { mode: 'random', selectedSound: null };
  }

  return JSON.parse(stored);
}

export function saveAlarmSettings(settings: AlarmSoundSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function setRandomSound(): AlarmSound {
  const randomSound = alarmSounds[Math.floor(Math.random() * alarmSounds.length)];
  const settings: AlarmSoundSettings = {
    mode: 'random',
    selectedSound: randomSound,
  };
  saveAlarmSettings(settings);
  return randomSound;
}

export function setCustomSound(sound: AlarmSound): void {
  const settings: AlarmSoundSettings = {
    mode: 'custom',
    selectedSound: sound,
  };
  saveAlarmSettings(settings);
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'gentle':
      return '🌙';
    case 'energetic':
      return '⚡';
    case 'nature':
      return '🌿';
    case 'classic':
      return '⏰';
    default:
      return '🔔';
  }
}
