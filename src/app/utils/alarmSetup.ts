export interface AlarmSetupState {
  isSetup: boolean;
  lastSetupTime?: string;
  alarmTime?: string;
}

const STORAGE_KEY = 'nooze_alarm_setup';

export function getAlarmSetupState(): AlarmSetupState {
  if (typeof window === 'undefined') {
    return { isSetup: false };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { isSetup: false };
  }

  return JSON.parse(stored);
}

export function markAlarmAsSetup(alarmTime: string): void {
  if (typeof window === 'undefined') return;

  const state: AlarmSetupState = {
    isSetup: true,
    lastSetupTime: new Date().toISOString(),
    alarmTime,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  // Dispatch event for UI updates
  window.dispatchEvent(new CustomEvent('alarm-setup-completed', {
    detail: { alarmTime }
  }));
}

export function isAlarmSetup(): boolean {
  return getAlarmSetupState().isSetup;
}

export function resetAlarmSetup(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
