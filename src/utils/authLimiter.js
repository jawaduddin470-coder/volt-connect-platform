// Auth utility with rate limiting stored in localStorage

const ATTEMPTS_KEY = 'vc_auth_attempts';
const LOCKOUT_KEY = 'vc_auth_lockout';
const MAX_ATTEMPTS = 5;
const COOLDOWN_AFTER = 3;
const COOLDOWN_SECONDS = 30;
const LOCKOUT_MINUTES = 10;
const WINDOW_MINUTES = 10;

export function getAuthAttempts() {
  try {
    const data = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '{"count":0,"timestamps":[]}');
    const windowMs = WINDOW_MINUTES * 60 * 1000;
    const now = Date.now();
    // Filter timestamps within window
    data.timestamps = (data.timestamps || []).filter(t => now - t < windowMs);
    data.count = data.timestamps.length;
    return data;
  } catch {
    return { count: 0, timestamps: [] };
  }
}

export function getLockoutRemaining() {
  try {
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) return Math.ceil((lockoutUntil - now) / 1000);
    return 0;
  } catch {
    return 0;
  }
}

export function recordFailedAttempt() {
  const data = getAuthAttempts();
  data.timestamps.push(Date.now());
  data.count = data.timestamps.length;
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));

  if (data.count >= MAX_ATTEMPTS) {
    const lockoutUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
    localStorage.setItem(LOCKOUT_KEY, String(lockoutUntil));
  }

  return data.count;
}

export function resetAuthAttempts() {
  localStorage.removeItem(ATTEMPTS_KEY);
  localStorage.removeItem(LOCKOUT_KEY);
}

export function getCooldownSeconds(count) {
  if (count >= MAX_ATTEMPTS) return LOCKOUT_MINUTES * 60;
  if (count >= COOLDOWN_AFTER) return COOLDOWN_SECONDS;
  return 0;
}

// Firebase error code → user-friendly message
export function getFriendlyAuthError(error) {
  const code = error?.code || error?.message || '';
  if (code.includes('network-request-failed')) return 'Check your internet connection.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Please wait 60 seconds.';
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) return 'Invalid email or password.';
  if (code.includes('email-already-in-use')) return 'Account already exists. Please sign in.';
  if (code.includes('weak-password')) return 'Password must be at least 6 characters.';
  if (code.includes('invalid-email')) return 'Please enter a valid email address.';
  return 'Something went wrong. Please try again.';
}
