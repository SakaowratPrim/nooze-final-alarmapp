export interface PendingRequest {
  id: string;
  type: 'buddy' | 'chain';
  targetName: string; // buddy username or chain code
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface IncomingRequest {
  id: string;
  fromUsername: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

const STORAGE_KEY = 'nooze_pending_requests';
const INCOMING_KEY = 'nooze_incoming_requests';

export function getPendingRequests(): PendingRequest[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function savePendingRequests(requests: PendingRequest[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function addPendingRequest(type: 'buddy' | 'chain', targetName: string): PendingRequest {
  const requests = getPendingRequests();

  const newRequest: PendingRequest = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type,
    targetName,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };

  requests.push(newRequest);
  savePendingRequests(requests);
  return newRequest;
}

export function cancelPendingRequest(id: string): boolean {
  const requests = getPendingRequests();
  const filteredRequests = requests.filter(r => r.id !== id);

  if (filteredRequests.length === requests.length) {
    return false; // Request not found
  }

  savePendingRequests(filteredRequests);
  return true;
}

export function hasPendingRequest(targetName: string): boolean {
  const requests = getPendingRequests();
  return requests.some(
    r => r.targetName.toLowerCase() === targetName.toLowerCase() && r.status === 'pending'
  );
}

export function acceptRequest(id: string): PendingRequest | null {
  const requests = getPendingRequests();
  const request = requests.find(r => r.id === id);

  if (!request) return null;

  request.status = 'accepted';
  savePendingRequests(requests);

  // Auto-remove accepted requests after returning
  setTimeout(() => {
    const updatedRequests = getPendingRequests().filter(r => r.id !== id);
    savePendingRequests(updatedRequests);
  }, 100);

  return request;
}

// Incoming requests (requests sent TO the user)
export function getIncomingRequests(): IncomingRequest[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(INCOMING_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function saveIncomingRequests(requests: IncomingRequest[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INCOMING_KEY, JSON.stringify(requests));
}

export function acceptIncomingRequest(id: string): IncomingRequest | null {
  const requests = getIncomingRequests();
  const request = requests.find(r => r.id === id);

  if (!request) return null;

  request.status = 'accepted';
  saveIncomingRequests(requests);

  // Remove after accepting
  setTimeout(() => {
    const updatedRequests = getIncomingRequests().filter(r => r.id !== id);
    saveIncomingRequests(updatedRequests);
  }, 100);

  return request;
}

export function declineIncomingRequest(id: string): boolean {
  const requests = getIncomingRequests();
  const filteredRequests = requests.filter(r => r.id !== id);

  if (filteredRequests.length === requests.length) {
    return false;
  }

  saveIncomingRequests(filteredRequests);
  return true;
}

export function getIncomingRequestCount(): number {
  const requests = getIncomingRequests();
  return requests.filter(r => r.status === 'pending').length;
}

// Simulate incoming buddy requests for demo
export function simulateIncomingRequest(fromUsername: string, delayMs: number = 3000): void {
  setTimeout(() => {
    const requests = getIncomingRequests();

    // Don't add duplicate requests
    if (requests.some(r => r.fromUsername === fromUsername && r.status === 'pending')) {
      return;
    }

    const newRequest: IncomingRequest = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      fromUsername,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    requests.push(newRequest);
    saveIncomingRequests(requests);

    // Notify UI
    window.dispatchEvent(new CustomEvent('incoming-buddy-request', {
      detail: { request: newRequest }
    }));
  }, delayMs);
}

// Simulate auto-accept for demo purposes (would be real API in production)
export function simulateAutoAccept(requestId: string, delayMs: number = 5000): void {
  setTimeout(() => {
    const requests = getPendingRequests();
    const request = requests.find(r => r.id === requestId);

    if (request && request.status === 'pending') {
      // Instead of auto-accepting, simulate an incoming request
      simulateIncomingRequest(request.targetName, 1000);

      // Mark outgoing request as accepted
      acceptRequest(requestId);

      // Trigger a custom event to notify UI
      window.dispatchEvent(new CustomEvent('buddy-request-accepted', {
        detail: { requestId, targetName: request.targetName }
      }));
    }
  }, delayMs);
}

// Auto-generate incoming buddy requests for demo
const DEMO_USERNAMES = ['alex_sleepy', 'morning_star', 'early_bird', 'night_owl123', 'zen_waker', 'coffee_lover', 'sunrise_sam', 'sleepy_joe'];

export function startAutoGenerateIncomingRequests(): void {
  // Generate first request after 10 seconds
  setTimeout(() => {
    const randomUsername = DEMO_USERNAMES[Math.floor(Math.random() * DEMO_USERNAMES.length)];
    simulateIncomingRequest(randomUsername, 0);
  }, 10000);

  // Generate additional requests every 30-60 seconds
  setInterval(() => {
    const currentRequests = getIncomingRequests().filter(r => r.status === 'pending');

    // Only generate if less than 3 pending requests
    if (currentRequests.length < 3) {
      const randomUsername = DEMO_USERNAMES[Math.floor(Math.random() * DEMO_USERNAMES.length)];
      const randomDelay = Math.random() * 30000; // 0-30 seconds
      simulateIncomingRequest(randomUsername, randomDelay);
    }
  }, 45000); // Check every 45 seconds
}
