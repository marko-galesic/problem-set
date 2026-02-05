import { describe, test, expect, beforeAll, beforeEach, afterAll, jest } from '@jest/globals';
import { createAppTestClient } from '../utils/appTestClient.js';
import { getDatabase } from '../../db/database.js';
import { getSubmissionById, insertChallenge, insertSubmission } from '../../db/queries.js';

const mockCreate = jest.fn();

let app;
let client;
let originalApiKey;

function mockOpenAiModule() {
  jest.unstable_mockModule('openai', () => ({
    default: class OpenAI {
      constructor() {
        this.chat = {
          completions: {
            create: (...args) => mockCreate(...args)
          }
        };
      }
    }
  }));
}

async function waitForTechBarLabel(submissionId, expectedLabel) {
  const maxAttempts = 20;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const submission = getSubmissionById(submissionId);
    if (submission?.tech_bar_label === expectedLabel) {
      return submission;
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  return getSubmissionById(submissionId);
}

describe('AI-assisted endpoints', () => {
  beforeAll(async () => {
    originalApiKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.MOCK_EXECUTION = '1';

    await jest.resetModules();
    mockOpenAiModule();
    ({ app } = await import('../../server.js'));
    client = createAppTestClient(app);
  });

  beforeEach(() => {
    mockCreate.mockReset();
    const db = getDatabase();
    db.prepare('DELETE FROM next_challenge_recommendations').run();
    db.prepare('DELETE FROM recommendation_mix_state').run();
    db.prepare('DELETE FROM submissions').run();
  });

  afterAll(() => {
    if (originalApiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalApiKey;
    }
  });

  test('rejects recommend-next-challenge when submissions is not an array', async () => {
    const response = await client.post('/api/recommend-next-challenge', { submissions: 'nope' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('rejects progress-report when submissions is not an array', async () => {
    const response = await client.post('/api/progress-report', { submissions: 'nope' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('recommends next challenge based on retention signals', async () => {
    insertChallenge({
      id: 'two_sum',
      name: 'Two Sum',
      folder: 'two_sum',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: 'easy',
      topics: ['arrays']
    });
    insertSubmission({
      id: 'sub-1',
      challenge_id: 'two_sum',
      avg_time: 90,
      timer_time: 1200,
      date: new Date('2024-01-01T00:00:00Z').toISOString(),
      submit_attempts: 1,
      guidance_level: 'Independent',
      language: 'java'
    });

    const response = await client.post('/api/recommend-next-challenge', {
      submissions: [],
      challenges: [
        { id: 'two_sum', name: 'Two Sum', difficulty: 'easy', topics: ['arrays'] }
      ]
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Two Sum');
    expect(response.body).toHaveProperty('difficulty', 'easy');
    expect(response.body).toHaveProperty('explanation');
    expect(response.body).toHaveProperty('mode', 'seen');
  });

  test('selects a new challenge when mix EMA favors new', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              name: 'Valid Parentheses',
              explanation: 'Stack practice in a weaker topic.'
            })
          }
        }
      ]
    });

    insertChallenge({
      id: 'two_sum',
      name: 'Two Sum',
      folder: 'two_sum',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: 'easy',
      topics: ['arrays']
    });
    insertChallenge({
      id: 'valid_parentheses',
      name: 'Valid Parentheses',
      folder: 'valid_parentheses',
      test_file: './testCases/validParenthesesTests.js',
      adapter: 'standard:validParentheses:java',
      difficulty: 'easy',
      topics: ['stack']
    });
    insertSubmission({
      id: 'sub-2',
      challenge_id: 'two_sum',
      avg_time: 90,
      timer_time: 1200,
      date: new Date('2024-01-01T00:00:00Z').toISOString(),
      submit_attempts: 1,
      guidance_level: 'Independent',
      language: 'java'
    });

    const db = getDatabase();
    db.prepare(`
      INSERT INTO recommendation_mix_state (language, ema_seen_share, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(language) DO UPDATE SET ema_seen_share = excluded.ema_seen_share
    `).run('java', 0.9);

    const response = await client.post('/api/recommend-next-challenge', {
      submissions: [],
      challenges: []
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Valid Parentheses');
    expect(response.body).toHaveProperty('mode', 'new');
    expect(mockCreate).toHaveBeenCalledTimes(1);
    const updated = db.prepare('SELECT ema_seen_share FROM recommendation_mix_state WHERE language = ?').get('java');
    expect(updated.ema_seen_share).toBeCloseTo(0.72, 2);
  });

  test('retries when AI suggests a recent challenge', async () => {
    mockCreate
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                name: 'Two Sum',
                explanation: 'Recent pick.'
              })
            }
          }
        ]
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                name: 'Valid Parentheses',
                explanation: 'Stack practice.'
              })
            }
          }
        ]
      });

    insertChallenge({
      id: 'two_sum',
      name: 'Two Sum',
      folder: 'two_sum',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: 'easy',
      topics: ['arrays']
    });
    insertChallenge({
      id: 'valid_parentheses',
      name: 'Valid Parentheses',
      folder: 'valid_parentheses',
      test_file: './testCases/validParenthesesTests.js',
      adapter: 'standard:validParentheses:java',
      difficulty: 'easy',
      topics: ['stack']
    });
    insertSubmission({
      id: 'sub-recent',
      challenge_id: 'two_sum',
      avg_time: 90,
      timer_time: 1200,
      date: new Date().toISOString(),
      submit_attempts: 1,
      guidance_level: 'Independent',
      language: 'java'
    });

    const db = getDatabase();
    db.prepare(`
      INSERT INTO recommendation_mix_state (language, ema_seen_share, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(language) DO UPDATE SET ema_seen_share = excluded.ema_seen_share
    `).run('java', 0.9);

    const response = await client.post('/api/recommend-next-challenge', {
      submissions: [],
      challenges: []
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Valid Parentheses');
    expect(response.body).toHaveProperty('mode', 'new');
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  test('errors after retry when AI response remains invalid', async () => {
    mockCreate
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({ name: '', explanation: '' })
            }
          }
        ]
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({ name: '', explanation: '' })
            }
          }
        ]
      });

    insertChallenge({
      id: 'two_sum',
      name: 'Two Sum',
      folder: 'two_sum',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: 'easy',
      topics: ['arrays']
    });

    const db = getDatabase();
    db.prepare(`
      INSERT INTO recommendation_mix_state (language, ema_seen_share, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(language) DO UPDATE SET ema_seen_share = excluded.ema_seen_share
    `).run('java', 0.9);

    const response = await client.post('/api/recommend-next-challenge', {
      submissions: [],
      challenges: []
    });

    expect(response.status).toBe(502);
    expect(response.body).toHaveProperty('error');
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  test('evaluates tech bar label asynchronously on submission', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({ label: 'met' })
          }
        }
      ]
    });

    const submissionData = {
      challenge: 'two_sum',
      avgTime: 95,
      timerTime: 4800,
      date: new Date().toISOString(),
      solution: 'class TwoSum { public int[] twoSum(int[] nums, int target) { return null; } }'
    };

    const response = await client.post('/api/submissions', submissionData);
    expect(response.status).toBe(200);

    const submissionId = response.body.submission.id;
    const submission = await waitForTechBarLabel(submissionId, 'met');

    expect(submission).toBeDefined();
    expect(submission.tech_bar_label).toBe('met');
    expect(submission.tech_bar_status).toBe('completed');
  });

  test('returns progress report', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: { content: 'You made solid progress today.' }
        }
      ]
    });

    const response = await client.post('/api/progress-report', {
      submissions: [
        {
          challenge: 'two_sum',
          challengeName: 'Two Sum',
          avgTime: 12,
          timerTime: 1200,
          date: new Date().toISOString()
        }
      ],
      dateKey: '2024-01-01'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('report');
  });

  test('returns 503 when OpenAI key is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const response = await client.post('/api/bug-hunt', { code: 'class Demo {}' });
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    process.env.OPENAI_API_KEY = 'test-key';
  });

  test('returns guided chat response', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: { content: 'Try describing your approach step by step.' }
        }
      ]
    });

    const response = await client.post('/api/guide-chat', {
      code: 'class TwoSum { }',
      challengeId: 'two_sum',
      language: 'java',
      descriptionHtml: '<p>desc</p>',
      testCasesPreview: { runTests: [] },
      messages: [
        { role: 'assistant', content: '  ' },
        { role: 'user', content: 'Help me' }
      ]
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('answer');
  });

  test('validates guide-chat payload', async () => {
    const response = await client.post('/api/guide-chat', { code: '' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('returns bug hunt hint', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: { content: '- Off-by-one in loop condition.' }
        }
      ]
    });

    const response = await client.post('/api/bug-hunt', {
      code: 'class TwoSum { }',
      challengeName: 'Two Sum',
      language: 'java',
      descriptionHtml: '<p>desc</p>',
      testCasesPreview: { runTests: [] }
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('answer');
  });

  test('evaluates bug hint severity', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              disableMinor: true,
              rationale: 'Reveals the key fix.'
            })
          }
        }
      ]
    });

    const response = await client.post('/api/bug-hunt-evaluate', {
      code: 'class TwoSum { }',
      bugAnswer: 'Use a hash map',
      language: 'java',
      descriptionHtml: '<p>desc</p>',
      testCasesPreview: { runTests: [] }
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('disableMinor', true);
  });

  test('validates bug-hunt-evaluate payload', async () => {
    const response = await client.post('/api/bug-hunt-evaluate', { code: 'class Demo {}' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
