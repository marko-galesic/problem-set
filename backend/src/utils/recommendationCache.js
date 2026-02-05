import { createHash } from 'crypto';

export function buildRecommendationHistoryHash(language, submissionCount) {
  const normalizedLanguage = typeof language === 'string' && language.trim()
    ? language.trim().toLowerCase()
    : 'java';
  const count = Number.isFinite(submissionCount) ? submissionCount : 0;
  const payload = `${normalizedLanguage}:${count}`;
  return createHash('sha256').update(payload).digest('hex');
}
