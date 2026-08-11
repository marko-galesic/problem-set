import { apiFetch } from '../api/client';
function getStorageKey(challenge, key, language) {
  const langPrefix = language ? `${language}_` : '';
  return `${challenge}_${langPrefix}${key}`;
}

const NEXT_CHALLENGE_CACHE_KEY = 'next_challenge_recommendation_v1';

function normalizeLanguageKey(value) {
  if (typeof value !== 'string') {
    return 'java';
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'python') {
    return 'python';
  }
  if (normalized === 'javascript' || normalized === 'js') {
    return 'javascript';
  }
  if (normalized === 'typescript' || normalized === 'ts') {
    return 'typescript';
  }
  return 'java';
}

function readNextChallengeCache() {
  const raw = localStorage.getItem(NEXT_CHALLENGE_CACHE_KEY);
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    return {};
  }
  return {};
}

function writeNextChallengeCache(cache) {
  localStorage.setItem(NEXT_CHALLENGE_CACHE_KEY, JSON.stringify(cache));
}

export function getNextChallengeRecommendation(language = 'java') {
  const key = normalizeLanguageKey(language);
  const cache = readNextChallengeCache();
  const entry = cache[key];
  if (!entry || typeof entry !== 'object') {
    return null;
  }
  return entry;
}

export function saveNextChallengeRecommendation(language, recommendation) {
  if (!recommendation || typeof recommendation !== 'object') {
    return null;
  }
  const key = normalizeLanguageKey(language);
  const cache = readNextChallengeCache();
  const cachedAt = typeof recommendation.cachedAt === 'string'
    ? recommendation.cachedAt
    : new Date().toISOString();
  const entry = {
    ...recommendation,
    language: key,
    cachedAt
  };
  cache[key] = entry;
  writeNextChallengeCache(cache);
  return entry;
}

export function clearNextChallengeRecommendation(language) {
  if (!language) {
    localStorage.removeItem(NEXT_CHALLENGE_CACHE_KEY);
    return;
  }
  const key = normalizeLanguageKey(language);
  const cache = readNextChallengeCache();
  if (!cache[key]) {
    return;
  }
  delete cache[key];
  writeNextChallengeCache(cache);
}

export function saveImplementation(code, avgTime, testCount, passed, challenge = 'two_sum', language = 'java') {
  const implementations = getImplementations(challenge, language);
  
  const newImpl = {
    id: crypto.randomUUID(),
    code,
    timestamp: new Date().toISOString(),
    avgTime,
    testCount,
    passed
  };

  implementations.push(newImpl);
  localStorage.setItem(getStorageKey(challenge, 'implementations', language), JSON.stringify(implementations));
  
  return newImpl;
}

export function getImplementations(challenge = 'two_sum', language = 'java') {
  const stored = localStorage.getItem(getStorageKey(challenge, 'implementations', language));
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function clearImplementations(challenge = 'two_sum', language = 'java') {
  localStorage.removeItem(getStorageKey(challenge, 'implementations', language));
}

export function getAverageTime(challenge = 'two_sum', language = 'java') {
  const implementations = getImplementations(challenge, language);
  if (implementations.length === 0) return 0;
  
  const total = implementations.reduce((sum, impl) => sum + (impl.avgTime || 0), 0);
  return Math.round(total / implementations.length);
}

export function saveDividerPosition(position, challenge = 'two_sum') {
  localStorage.setItem(getStorageKey(challenge, 'divider_position'), position.toString());
}

export function getDividerPosition(challenge = 'two_sum') {
  const saved = localStorage.getItem(getStorageKey(challenge, 'divider_position'));
  if (!saved) return null;
  const position = parseFloat(saved);
  return isNaN(position) ? null : position;
}

export function saveEditorMaximized(maximized, challenge = 'two_sum') {
  localStorage.setItem(getStorageKey(challenge, 'editor_maximized'), maximized.toString());
}

export function getEditorMaximized(challenge = 'two_sum') {
  const saved = localStorage.getItem(getStorageKey(challenge, 'editor_maximized'));
  return saved === 'true';
}

export function saveVerticalDividerPosition(position, challenge = 'two_sum') {
  localStorage.setItem(getStorageKey(challenge, 'vertical_divider_position'), position.toString());
}

export function getVerticalDividerPosition(challenge = 'two_sum') {
  const saved = localStorage.getItem(getStorageKey(challenge, 'vertical_divider_position'));
  if (!saved) return null;
  const position = parseFloat(saved);
  return isNaN(position) ? null : position;
}

export function saveCurrentCode(code, challenge = 'two_sum', language = 'java') {
  localStorage.setItem(getStorageKey(challenge, 'current_code', language), code);
}

export function getCurrentCode(challenge = 'two_sum', language = 'java') {
  return localStorage.getItem(getStorageKey(challenge, 'current_code', language));
}

export async function saveLanguagePreference(language) {
  try {
    const response = await apiFetch('/api/language-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ language })
    });

    if (!response.ok) {
      throw new Error('Failed to save language preference');
    }

    const data = await response.json();
    return data.language ?? language;
  } catch (error) {
    console.error('Error saving language preference:', error);
    return null;
  }
}

export async function getLanguagePreference() {
  try {
    const response = await apiFetch('/api/language-preference');

    if (!response.ok) {
      throw new Error('Failed to load language preference');
    }

    const data = await response.json();
    return data.language ?? null;
  } catch (error) {
    console.error('Error loading language preference:', error);
    return null;
  }
}

export function getSubmitAttempts(challenge = 'two_sum', language = 'java') {
  const stored = localStorage.getItem(getStorageKey(challenge, 'submit_attempts', language));
  if (!stored) return 0;
  const parsed = Number(stored);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function incrementSubmitAttempts(challenge = 'two_sum', language = 'java') {
  const current = getSubmitAttempts(challenge, language);
  const next = current + 1;
  localStorage.setItem(getStorageKey(challenge, 'submit_attempts', language), next.toString());
  return next;
}

export function resetSubmitAttempts(challenge = 'two_sum', language = 'java') {
  localStorage.setItem(getStorageKey(challenge, 'submit_attempts', language), '0');
}

export function saveTimerState(challenge, elapsedTime, isRunning, accumulatedTime, language) {
  const timerState = {
    elapsedTime,
    isRunning,
    accumulatedTime,
    timestamp: Date.now()
  };
  localStorage.setItem(getStorageKey(challenge, 'timer_state', language), JSON.stringify(timerState));
}

export function getTimerState(challenge = 'two_sum', language) {
  let saved = localStorage.getItem(getStorageKey(challenge, 'timer_state', language));
  if (!saved && language) {
    saved = localStorage.getItem(getStorageKey(challenge, 'timer_state'));
  }
  if (!saved) return null;
  
  try {
    const state = JSON.parse(saved);
    return {
      elapsedTime: state.elapsedTime || 0,
      isRunning: state.isRunning || false,
      accumulatedTime: state.accumulatedTime || 0
    };
  } catch (e) {
    return null;
  }
}

// Submission API functions
export async function saveSubmission(challenge, avgTime, timerTime, solution, guidanceLevel, submitAttempts, language) {
  try {
    const response = await apiFetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        challenge,
        avgTime,
        timerTime,
        date: new Date().toISOString(),
        solution,
        guidanceLevel,
        submitAttempts,
        language
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save submission');
    }
    
    const data = await response.json();
    return data.submission;
  } catch (error) {
    console.error('Error saving submission:', error);
    throw error;
  }
}

export async function getSubmissions(challenge = 'two_sum') {
  try {
    const response = await apiFetch(`/api/submissions?challenge=${challenge}`);
    
    if (!response.ok) {
      throw new Error('Failed to load submissions');
    }
    
    const data = await response.json();
    return data.submissions || [];
  } catch (error) {
    console.error('Error loading submissions:', error);
    return [];
  }
}

export async function deleteSubmission(submissionId, challenge = 'two_sum') {
  try {
    const response = await apiFetch(`/api/submissions?id=${submissionId}&challenge=${challenge}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to delete submission');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
}

export async function updateSubmission(submissionId, timerTime, challenge = 'two_sum') {
  try {
    const response = await apiFetch('/api/submissions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: submissionId,
        timerTime,
        challenge
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update submission');
    }
    
    const data = await response.json();
    return data.submission;
  } catch (error) {
    console.error('Error updating submission:', error);
    throw error;
  }
}
