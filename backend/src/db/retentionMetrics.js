import {
  getAllChallenges,
  getAllSubmissions,
  getLatestFitnessSnapshot,
  getFitnessSnapshotEntries,
  replaceRetentionMetrics
} from './queries.js';

const GUIDANCE_SCORES = {
  Independent: 1,
  Minor: 0.7,
  Guided: 0.4
};

const DEFAULT_GUIDANCE_SCORE = 0.7;
const DEFAULT_TIME_SCORE = 0.5;
const DEFAULT_TIME_BASELINE_MS = 20 * 60 * 1000;
const DEFAULT_RECENCY_WINDOW_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

function normalizeLanguage(value) {
  if (!value) {
    return 'java';
  }
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'python') return 'python';
  if (normalized === 'javascript' || normalized === 'js') return 'javascript';
  if (normalized === 'typescript' || normalized === 'ts') return 'typescript';
  if (normalized === 'cpp' || normalized === 'c++') return 'cpp';
  return 'java';
}

function parseTopics(rawTopics) {
  if (!rawTopics) {
    return [];
  }
  if (Array.isArray(rawTopics)) {
    return rawTopics
      .map((topic) => (typeof topic === 'string' ? topic.trim() : ''))
      .filter((topic) => topic.length > 0);
  }
  if (typeof rawTopics !== 'string') {
    return [];
  }
  try {
    const parsed = JSON.parse(rawTopics);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((topic) => (typeof topic === 'string' ? topic.trim() : ''))
      .filter((topic) => topic.length > 0);
  } catch {
    return [];
  }
}

function toTimestamp(value, nowMs) {
  if (!value) {
    return nowMs;
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return nowMs;
  }
  return parsed;
}

function clampScore(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(1, Math.max(0, value));
}

function buildFitnessMap(entries) {
  const map = new Map();
  for (const entry of entries || []) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const topic = typeof entry.topic === 'string' ? entry.topic.trim() : '';
    const difficulty = typeof entry.difficulty === 'string' ? entry.difficulty.trim().toLowerCase() : '';
    if (!topic || !difficulty) {
      continue;
    }
    const fitness = Number(entry.fitness);
    if (!Number.isFinite(fitness)) {
      continue;
    }
    if (!map.has(topic)) {
      map.set(topic, new Map());
    }
    map.get(topic).set(difficulty, fitness);
  }
  return map;
}

function computeWeaknessScore(topics, difficulty, fitnessMap) {
  if (!topics || topics.length === 0 || !fitnessMap) {
    return null;
  }
  const difficultyKey = typeof difficulty === 'string' ? difficulty.trim().toLowerCase() : '';
  if (!difficultyKey || !['easy', 'medium', 'hard'].includes(difficultyKey)) {
    return null;
  }

  let maxWeakness = null;
  for (const topic of topics) {
    const topicMap = fitnessMap.get(topic);
    if (!topicMap) {
      continue;
    }
    const fitness = topicMap.get(difficultyKey);
    if (!Number.isFinite(fitness)) {
      continue;
    }
    const weakness = clampScore(1 - fitness);
    maxWeakness = maxWeakness === null ? weakness : Math.max(maxWeakness, weakness);
  }

  return maxWeakness;
}

export function computeRetentionMetricsData({
  challenges,
  submissions,
  fitnessEntries,
  language,
  now = Date.now(),
  timeBaselineMs = DEFAULT_TIME_BASELINE_MS,
  recencyWindowDays = DEFAULT_RECENCY_WINDOW_DAYS
} = {}) {
  const normalizedLanguage = normalizeLanguage(language);
  const nowMs = now instanceof Date ? now.getTime() : Number(now);
  const safeNowMs = Number.isFinite(nowMs) ? nowMs : Date.now();

  const challengeMap = new Map(
    (challenges || []).map((challenge) => [challenge.id, challenge])
  );

  const submissionsByChallenge = new Map();
  for (const submission of submissions || []) {
    if (!submission || typeof submission !== 'object') {
      continue;
    }
    const subLanguage = normalizeLanguage(submission.language);
    if (subLanguage !== normalizedLanguage) {
      continue;
    }
    const challengeId = submission.challenge_id || submission.challenge || submission.challengeId;
    if (!challengeId) {
      continue;
    }
    if (!submissionsByChallenge.has(challengeId)) {
      submissionsByChallenge.set(challengeId, []);
    }
    submissionsByChallenge.get(challengeId).push(submission);
  }

  const fitnessMap = buildFitnessMap(fitnessEntries);
  const results = [];

  for (const [challengeId, challengeSubmissions] of submissionsByChallenge.entries()) {
    if (!Array.isArray(challengeSubmissions) || challengeSubmissions.length === 0) {
      continue;
    }

    let lastSubmission = null;
    let lastTimestamp = -Infinity;

    for (const submission of challengeSubmissions) {
      const timestamp = toTimestamp(submission.date, safeNowMs);
      if (timestamp >= lastTimestamp) {
        lastTimestamp = timestamp;
        lastSubmission = submission;
      }
    }

    if (!lastSubmission) {
      continue;
    }

    const challenge = challengeMap.get(challengeId);
    const difficulty = typeof challenge?.difficulty === 'string'
      ? challenge.difficulty.trim().toLowerCase()
      : null;
    const topics = parseTopics(challenge?.topics);

    const guidanceLevel = lastSubmission.guidance_level || lastSubmission.guidanceLevel || 'Independent';
    const guidanceScore = GUIDANCE_SCORES[guidanceLevel] ?? DEFAULT_GUIDANCE_SCORE;

    const attemptsRaw = Number(lastSubmission.submit_attempts ?? lastSubmission.submitAttempts);
    const attempts = Number.isFinite(attemptsRaw) && attemptsRaw > 0 ? attemptsRaw : 1;
    const attemptScore = 1 / Math.sqrt(attempts);

    const timerTime = Number(lastSubmission.timer_time ?? lastSubmission.timerTime);
    const avgTime = Number(lastSubmission.avg_time ?? lastSubmission.avgTime);
    let timeScore = DEFAULT_TIME_SCORE;
    if (Number.isFinite(timerTime) && timerTime > 0) {
      timeScore = 1 / (1 + timerTime / timeBaselineMs);
    } else if (Number.isFinite(avgTime) && avgTime > 0) {
      timeScore = 1 / (1 + avgTime / timeBaselineMs);
    }

    const masteryScore = clampScore(
      0.4 * guidanceScore + 0.3 * attemptScore + 0.3 * timeScore
    );

    const recencyDays = Math.max(0, (safeNowMs - lastTimestamp) / DAY_MS);
    const recencyScore = clampScore(1 - Math.exp(-recencyDays / recencyWindowDays));

    const weaknessScore = computeWeaknessScore(topics, difficulty, fitnessMap);
    const priorityScore = weaknessScore === null
      ? null
      : clampScore(
        0.5 * recencyScore + 0.3 * weaknessScore + 0.2 * (1 - masteryScore)
      );

    const lastSubmissionAt = Number.isFinite(Date.parse(lastSubmission.date))
      ? new Date(Date.parse(lastSubmission.date)).toISOString()
      : null;

    results.push({
      challenge_id: challengeId,
      language: normalizedLanguage,
      last_submission_at: lastSubmissionAt,
      last_guidance_level: typeof guidanceLevel === 'string' ? guidanceLevel : null,
      last_submit_attempts: Number.isFinite(attemptsRaw) ? attemptsRaw : null,
      last_timer_time: Number.isFinite(timerTime) ? timerTime : null,
      last_avg_time: Number.isFinite(avgTime) ? avgTime : null,
      submission_count: challengeSubmissions.length,
      guidance_score: clampScore(guidanceScore),
      attempt_score: clampScore(attemptScore),
      time_score: clampScore(timeScore),
      mastery_score: masteryScore,
      recency_days: recencyDays,
      recency_score: recencyScore,
      weakness_score: weaknessScore,
      priority_score: priorityScore,
      difficulty,
      topics: JSON.stringify(topics)
    });
  }

  return results;
}

export function computeTopicRetentionMetricsData({
  challenges,
  submissions,
  fitnessEntries,
  language,
  now = Date.now(),
  timeBaselineMs = DEFAULT_TIME_BASELINE_MS,
  recencyWindowDays = DEFAULT_RECENCY_WINDOW_DAYS
} = {}) {
  const normalizedLanguage = normalizeLanguage(language);
  const nowMs = now instanceof Date ? now.getTime() : Number(now);
  const safeNowMs = Number.isFinite(nowMs) ? nowMs : Date.now();

  const challengeMeta = new Map(
    (challenges || []).map((challenge) => {
      const difficulty = typeof challenge?.difficulty === 'string'
        ? challenge.difficulty.trim().toLowerCase()
        : null;
      const topics = parseTopics(challenge?.topics);
      return [challenge.id, { difficulty, topics }];
    })
  );

  const topicGroups = new Map();
  const fitnessMap = buildFitnessMap(fitnessEntries);

  const getGroupKey = (topic, difficulty) => `${topic}::${difficulty ?? ''}`;
  const getOrCreateGroup = (topic, difficulty) => {
    const key = getGroupKey(topic, difficulty);
    if (!topicGroups.has(key)) {
      topicGroups.set(key, {
        topic,
        difficulty: difficulty ?? null,
        lastSubmission: null,
        lastTimestamp: -Infinity,
        submissionCount: 0
      });
    }
    return topicGroups.get(key);
  };

  for (const submission of submissions || []) {
    if (!submission || typeof submission !== 'object') {
      continue;
    }
    const subLanguage = normalizeLanguage(submission.language);
    if (subLanguage !== normalizedLanguage) {
      continue;
    }
    const challengeId = submission.challenge_id || submission.challenge || submission.challengeId;
    if (!challengeId) {
      continue;
    }
    const meta = challengeMeta.get(challengeId);
    const topics = meta?.topics || [];
    if (!Array.isArray(topics) || topics.length === 0) {
      continue;
    }
    const difficulty = meta?.difficulty ?? null;
    const timestamp = toTimestamp(submission.date, safeNowMs);

    for (const topic of topics) {
      const group = getOrCreateGroup(topic, difficulty);
      group.submissionCount += 1;
      if (timestamp >= group.lastTimestamp) {
        group.lastTimestamp = timestamp;
        group.lastSubmission = submission;
      }
    }
  }

  const results = [];
  for (const group of topicGroups.values()) {
    if (!group.lastSubmission) {
      continue;
    }

    const lastSubmission = group.lastSubmission;
    const guidanceLevel = lastSubmission.guidance_level || lastSubmission.guidanceLevel || 'Independent';
    const guidanceScore = GUIDANCE_SCORES[guidanceLevel] ?? DEFAULT_GUIDANCE_SCORE;

    const attemptsRaw = Number(lastSubmission.submit_attempts ?? lastSubmission.submitAttempts);
    const attempts = Number.isFinite(attemptsRaw) && attemptsRaw > 0 ? attemptsRaw : 1;
    const attemptScore = 1 / Math.sqrt(attempts);

    const timerTime = Number(lastSubmission.timer_time ?? lastSubmission.timerTime);
    const avgTime = Number(lastSubmission.avg_time ?? lastSubmission.avgTime);
    let timeScore = DEFAULT_TIME_SCORE;
    if (Number.isFinite(timerTime) && timerTime > 0) {
      timeScore = 1 / (1 + timerTime / timeBaselineMs);
    } else if (Number.isFinite(avgTime) && avgTime > 0) {
      timeScore = 1 / (1 + avgTime / timeBaselineMs);
    }

    const masteryScore = clampScore(
      0.4 * guidanceScore + 0.3 * attemptScore + 0.3 * timeScore
    );

    const recencyDays = Math.max(0, (safeNowMs - group.lastTimestamp) / DAY_MS);
    const recencyScore = clampScore(1 - Math.exp(-recencyDays / recencyWindowDays));

    const weaknessScore = computeWeaknessScore([group.topic], group.difficulty, fitnessMap);
    const priorityScore = weaknessScore === null
      ? null
      : clampScore(
        0.5 * recencyScore + 0.3 * weaknessScore + 0.2 * (1 - masteryScore)
      );

    const lastSubmissionAt = Number.isFinite(Date.parse(lastSubmission.date))
      ? new Date(Date.parse(lastSubmission.date)).toISOString()
      : null;

    results.push({
      topic: group.topic,
      difficulty: group.difficulty,
      language: normalizedLanguage,
      last_submission_at: lastSubmissionAt,
      last_guidance_level: typeof guidanceLevel === 'string' ? guidanceLevel : null,
      last_submit_attempts: Number.isFinite(attemptsRaw) ? attemptsRaw : null,
      last_timer_time: Number.isFinite(timerTime) ? timerTime : null,
      last_avg_time: Number.isFinite(avgTime) ? avgTime : null,
      submission_count: group.submissionCount,
      guidance_score: clampScore(guidanceScore),
      attempt_score: clampScore(attemptScore),
      time_score: clampScore(timeScore),
      mastery_score: masteryScore,
      recency_days: recencyDays,
      recency_score: recencyScore,
      weakness_score: weaknessScore,
      priority_score: priorityScore
    });
  }

  return results;
}

export function refreshRetentionMetrics({
  language = 'java',
  now = new Date(),
  timeBaselineMs = DEFAULT_TIME_BASELINE_MS,
  recencyWindowDays = DEFAULT_RECENCY_WINDOW_DAYS
} = {}) {
  const normalizedLanguage = normalizeLanguage(language);
  const challenges = getAllChallenges();
  const submissions = getAllSubmissions();
  const snapshotAt = getLatestFitnessSnapshot(normalizedLanguage);
  const fitnessEntries = snapshotAt
    ? getFitnessSnapshotEntries(snapshotAt, normalizedLanguage)
    : [];
  const computedAt = (now instanceof Date ? now : new Date(now)).toISOString();

  const metrics = computeRetentionMetricsData({
    challenges,
    submissions,
    fitnessEntries,
    language: normalizedLanguage,
    now,
    timeBaselineMs,
    recencyWindowDays
  });

  replaceRetentionMetrics(normalizedLanguage, metrics, computedAt);

  return {
    language: normalizedLanguage,
    count: metrics.length,
    computedAt,
    fitnessSnapshotAt: snapshotAt ?? null
  };
}

export function getTopicRetentionMetrics({
  language = 'java',
  now = new Date(),
  timeBaselineMs = DEFAULT_TIME_BASELINE_MS,
  recencyWindowDays = DEFAULT_RECENCY_WINDOW_DAYS
} = {}) {
  const normalizedLanguage = normalizeLanguage(language);
  const challenges = getAllChallenges();
  const submissions = getAllSubmissions();
  const snapshotAt = getLatestFitnessSnapshot(normalizedLanguage);
  const fitnessEntries = snapshotAt
    ? getFitnessSnapshotEntries(snapshotAt, normalizedLanguage)
    : [];
  const computedAt = (now instanceof Date ? now : new Date(now)).toISOString();

  const metrics = computeTopicRetentionMetricsData({
    challenges,
    submissions,
    fitnessEntries,
    language: normalizedLanguage,
    now,
    timeBaselineMs,
    recencyWindowDays
  });

  return {
    language: normalizedLanguage,
    count: metrics.length,
    computedAt,
    fitnessSnapshotAt: snapshotAt ?? null,
    metrics
  };
}
