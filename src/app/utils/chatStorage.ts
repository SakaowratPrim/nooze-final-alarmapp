export interface ChatMessage {
  id: string;
  buddyName: string;
  message: string;
  sender: 'me' | 'buddy';
  timestamp: string;
  read: boolean;
}

const STORAGE_KEY = 'nooze_chat_messages';

export function getChatMessages(buddyName?: string): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const allMessages: ChatMessage[] = JSON.parse(stored);

  if (buddyName) {
    return allMessages.filter(msg => msg.buddyName === buddyName);
  }

  return allMessages;
}

export function saveChatMessage(message: ChatMessage): void {
  if (typeof window === 'undefined') return;
  const messages = getChatMessages();
  messages.push(message);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export function getUnreadCount(buddyName: string): number {
  const messages = getChatMessages(buddyName);
  return messages.filter(msg => !msg.read && msg.sender === 'buddy').length;
}

export function markMessagesAsRead(buddyName: string): void {
  if (typeof window === 'undefined') return;
  const messages = getChatMessages();
  const updated = messages.map(msg => {
    if (msg.buddyName === buddyName && msg.sender === 'buddy') {
      return { ...msg, read: true };
    }
    return msg;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Simulate receiving messages from buddy
export function simulateBuddyMessage(buddyName: string, delayMs: number = 3000): void {
  const responses = [
    "Good morning! 🌅",
    "You got this! 💪",
    "Let's crush today!",
    "Nice streak! Keep it up! 🔥",
    "Early bird gets the worm! 🐦",
    "Proud of you! ⭐",
    "Another day, another win! 🎯",
  ];

  setTimeout(() => {
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const message: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      buddyName,
      message: randomResponse,
      sender: 'buddy',
      timestamp: new Date().toISOString(),
      read: false,
    };
    saveChatMessage(message);

    // Dispatch event to notify UI
    window.dispatchEvent(new CustomEvent('new-chat-message', {
      detail: { buddyName }
    }));
  }, delayMs);
}
