import { describe, test, expect, beforeAll, beforeEach, afterAll, jest } from '@jest/globals';
import { createAppTestClient } from '../utils/appTestClient.js';
import { getDatabase } from '../../db/database.js';
import { getSubmissionById } from '../../db/queries.js';

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

  test('recommends next challenge with formatted submissions', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              name: 'Two Sum',
              difficulty: 'easy',
              explanation: 'Solid foundation for hash map practice.'
            })
          }
        }
      ]
    });

    const response = await client.post('/api/recommend-next-challenge', {
      submissions: [
        {
          id: 'sub-1',
          challenge: 'two_sum',
          timerTime: -5,
          date: 'invalid-date',
          solution: 'ignored',
          techBarStatus: 'pending',
          techBarLabel: 'label'
        }
      ],
      challenges: []
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Two Sum');
    expect(response.body).toHaveProperty('difficulty', 'easy');
    expect(response.body).toHaveProperty('explanation');
    expect(response.body).toHaveProperty('systemPrompt');
    expect(response.body).toHaveProperty('userPrompt');
  });

  test('uses cached recommendation when history is unchanged', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              name: 'Two Sum',
              difficulty: 'easy',
              explanation: 'Solid foundation for hash map practice.'
            })
          }
        }
      ]
    });

    const payload = {
      submissions: [
        {
          id: 'sub-1',
          challenge: 'two_sum',
          timerTime: -5,
          date: 'invalid-date',
          solution: 'ignored',
          techBarStatus: 'pending',
          techBarLabel: 'label'
        }
      ],
      challenges: []
    };

    const firstResponse = await client.post('/api/recommend-next-challenge', payload);
    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body).toHaveProperty('name', 'Two Sum');
    expect(mockCreate).toHaveBeenCalledTimes(1);

    mockCreate.mockImplementation(() => {
      throw new Error('AI should not be called for cached recommendation');
    });

    const secondResponse = await client.post('/api/recommend-next-challenge', payload);
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body).toHaveProperty('name', 'Two Sum');
    expect(secondResponse.body).toHaveProperty('difficulty', 'easy');
    expect(mockCreate).toHaveBeenCalledTimes(1);
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
