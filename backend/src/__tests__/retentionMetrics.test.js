import { initDatabase, getDatabase } from '../db/database.js';
import { insertChallenge, insertSubmission, insertFitnessSnapshot } from '../db/queries.js';
import { computeRetentionMetricsData, refreshRetentionMetrics } from '../db/retentionMetrics.js';

describe('retention metrics data', () => {
  test('computeRetentionMetricsData builds component scores', () => {
    const challenges = [
      {
        id: 'c1',
        difficulty: 'easy',
        topics: JSON.stringify(['arrays', 'hashing'])
      },
      {
        id: 'c2',
        difficulty: 'medium',
        topics: JSON.stringify(['graphs'])
      }
    ];

    const submissions = [
      {
        challenge_id: 'c1',
        language: 'javascript',
        guidance_level: 'Independent',
        submit_attempts: 1,
        timer_time: 600000,
        avg_time: 600000,
        date: '2026-01-20T00:00:00.000Z'
      },
      {
        challenge_id: 'c1',
        language: 'javascript',
        guidance_level: 'Minor',
        submit_attempts: 4,
        timer_time: 1200000,
        avg_time: 1200000,
        date: '2026-02-01T00:00:00.000Z'
      },
      {
        challenge_id: 'c2',
        language: 'javascript',
        guidance_level: 'Guided',
        submit_attempts: 2,
        timer_time: 1200000,
        avg_time: 1200000,
        date: '2026-02-02T00:00:00.000Z'
      }
    ];

    const fitnessEntries = [
      { topic: 'arrays', difficulty: 'easy', fitness: 0.8 },
      { topic: 'hashing', difficulty: 'easy', fitness: 0.4 }
    ];

    const now = new Date('2026-02-03T00:00:00.000Z');
    const metrics = computeRetentionMetricsData({
      challenges,
      submissions,
      fitnessEntries,
      language: 'javascript',
      now
    });

    const c1 = metrics.find((metric) => metric.challenge_id === 'c1');
    const c2 = metrics.find((metric) => metric.challenge_id === 'c2');

    expect(c1).toBeTruthy();
    expect(c1.submission_count).toBe(2);
    expect(c1.guidance_score).toBeCloseTo(0.7, 5);
    expect(c1.attempt_score).toBeCloseTo(0.5, 5);
    expect(c1.time_score).toBeCloseTo(0.5, 5);
    expect(c1.mastery_score).toBeCloseTo(0.58, 2);
    expect(c1.recency_score).toBeGreaterThan(0.1);
    expect(c1.weakness_score).toBeCloseTo(0.6, 5);
    expect(c1.priority_score).toBeCloseTo(0.33, 2);

    expect(c2).toBeTruthy();
    expect(c2.weakness_score).toBeNull();
    expect(c2.priority_score).toBeNull();
  });

  test('refreshRetentionMetrics writes retention_metrics rows', () => {
    initDatabase();

    insertChallenge({
      id: 'retention_test',
      name: 'Retention Test',
      folder: 'retention_test',
      test_file: './testCases/retentionTest.js',
      adapter: 'standard:retentionTest:java',
      difficulty: 'easy',
      topics: ['arrays']
    });

    insertSubmission({
      id: 'sub-retention-1',
      challenge_id: 'retention_test',
      avg_time: 600000,
      timer_time: 600000,
      date: '2026-02-01T00:00:00.000Z',
      solution: null,
      submit_attempts: 1,
      tech_bar_status: 'pending',
      tech_bar_label: null,
      guidance_level: 'Independent',
      language: 'javascript'
    });

    insertFitnessSnapshot('2026-02-02T00:00:00.000Z', [
      {
        topic: 'arrays',
        difficulty: 'easy',
        fitness: 0.25,
        submissionCount: 1,
        lastSubmission: '2026-02-01T00:00:00.000Z',
        language: 'javascript'
      }
    ]);

    refreshRetentionMetrics({
      language: 'javascript',
      now: new Date('2026-02-03T00:00:00.000Z')
    });

    const db = getDatabase();
    const row = db.prepare(`
      SELECT
        challenge_id,
        submission_count,
        weakness_score,
        mastery_score,
        computed_at
      FROM retention_metrics
      WHERE challenge_id = ? AND language = ?
    `).get('retention_test', 'javascript');

    expect(row).toBeTruthy();
    expect(row.submission_count).toBe(1);
    expect(row.weakness_score).toBeCloseTo(0.75, 5);
    expect(row.mastery_score).toBeGreaterThan(0.5);
    expect(row.computed_at).toBeTruthy();
  });
});
