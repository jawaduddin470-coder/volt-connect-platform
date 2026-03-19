// Volt AI service with all 7 fixes applied

const MAX_REQUESTS_PER_MINUTE = 5;
const CACHE_PREFIX = 'voltai_';
const MAX_CACHE_ENTRIES = 10;

let requestTimestamps = [];

function isRateLimited() {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(t => now - t < 60000);
  return requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE;
}

function getRateLimitCooldown() {
  if (requestTimestamps.length === 0) return 0;
  const oldest = requestTimestamps[0];
  const expireAt = oldest + 60000;
  return Math.max(0, Math.ceil((expireAt - Date.now()) / 1000));
}

function trackRequest() {
  requestTimestamps.push(Date.now());
}

function getCacheKey(message) {
  return CACHE_PREFIX + btoa(encodeURIComponent(message)).slice(0, 40);
}

function getCached(message) {
  try {
    const cached = sessionStorage.getItem(getCacheKey(message));
    return cached ? JSON.parse(cached) : null;
  } catch { return null; }
}

function setCache(message, response) {
  try {
    // Evict oldest if at capacity
    const keys = Object.keys(sessionStorage).filter(k => k.startsWith(CACHE_PREFIX));
    if (keys.length >= MAX_CACHE_ENTRIES) {
      sessionStorage.removeItem(keys[0]);
    }
    sessionStorage.setItem(getCacheKey(message), JSON.stringify(response));
  } catch {} // sessionStorage full – best effort
}

async function callWithRetry(fn, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if ((err.status === 429 || err.message === '429') && i < retries - 1) {
        await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
      } else {
        throw err;
      }
    }
  }
}

const SYSTEM_PROMPT = `You are Volt AI, a smart EV charging assistant for VoltConnect. 
Help users find chargers, plan routes, and answer EV-related questions about India. 
You know about Tata Nexon EV, MG ZS EV, Ather 450X, Ola S1 Pro, and major Indian charging networks 
like Ather Grid, Tata Power EZ, Statiq, ChargeZone, and HPCL. Be concise, friendly, and helpful. 
Keep responses under 100 words unless asked for more detail.`;

export async function sendVoltAIMessage(userMessage, conversationHistory) {
  // FIX 5: Check cache first
  const cached = getCached(userMessage);
  if (cached) return { response: cached, fromCache: true };

  // FIX 2: Rate limiting
  if (isRateLimited()) {
    const cooldown = getRateLimitCooldown();
    return { error: 'rate_limited', cooldown };
  }

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    return { error: 'no_key', response: 'Volt AI is not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.' };
  }

  trackRequest();

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.slice(-8), // Keep last 8 messages for context
    { role: 'user', content: userMessage },
  ];

  // FIX 3: Retry with exponential backoff
  try {
    const result = await callWithRetry(async () => {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://voltconnect.app',
          'X-Title': 'VoltConnect',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free', // FIX 7: Free, high-rate model
          max_tokens: 300,
          temperature: 0.7,
          messages,
        }),
      });

      if (response.status === 429) {
        const err = new Error('429');
        err.status = 429;
        throw err;
      }
      if (response.status === 401) throw new Error('Invalid API key');
      if (!response.ok) throw new Error(`API error ${response.status}`);

      const data = await response.json();
      return data?.choices?.[0]?.message?.content || null;
    });

    if (result) {
      setCache(userMessage, result); // FIX 5: Cache successful response
      return { response: result };
    }
    return { response: 'Volt AI returned an empty response. Please try again.' };
  } catch (err) {
    if (err.status === 429 || err.message === '429') {
      return { response: 'Volt AI is busy right now. Please try again in a moment. ⚡' };
    }
    return { response: 'Volt is having trouble connecting. Please check your internet and try again.' };
  }
}

export { isRateLimited, getRateLimitCooldown };
