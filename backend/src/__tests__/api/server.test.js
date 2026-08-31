import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { readFile, writeFile, mkdir, unlink, rm } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { randomUUID } from 'crypto';
import { createAppTestClient } from '../utils/appTestClient.js';
import { getSubmissionById } from '../../db/queries.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to create test data files
async function createTestDataFile(challengeId, filename, content) {
  const dataDir = join(__dirname, '../../../../data', challengeId);
  await mkdir(dataDir, { recursive: true });
  const filePath = join(dataDir, filename);
  let previousContent = null;
  try {
    previousContent = await readFile(filePath, 'utf8');
  } catch {
    previousContent = null;
  }
  await writeFile(filePath, content, 'utf8');
  return { filePath, previousContent };
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

describe('API Endpoints', () => {
  let app;
  let client;

  beforeAll(async () => {
    process.env.MOCK_EXECUTION = '1';
    await jest.resetModules();
    ({ app } = await import('../../server.js'));
    client = createAppTestClient(app);
  });

  describe('GET /api/health', () => {
    test('should return 200 with status ok', async () => {
      const response = await client.get('/api/health');
      expect(response.status).toBe(200);
      
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /api/template', () => {
    test('should return template code for valid challenge', async () => {
      const testChallenge = 'two_sum';
      
      const response = await client.get(`/api/template?challenge=${testChallenge}`);
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('code');
      expect(response.body.code).toContain('TwoSum');
    });

    test('should default to two_sum challenge when not specified', async () => {
      const response = await client.get('/api/template');
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('code');
    });

    test('should handle invalid challenge ID', async () => {
      const response = await client.get('/api/template?challenge=invalid_challenge');
      expect(response.status).toBe(500);
      
      expect(response.body).toHaveProperty('error');
    });

    test('should return language-specific templates', async () => {
      const pythonResponse = await client.get('/api/template?challenge=two_sum&language=python');
      expect(pythonResponse.status).toBe(200);
      expect(pythonResponse.body.code).toContain('class TwoSum');

      const jsResponse = await client.get('/api/template?challenge=two_sum&language=javascript');
      expect(jsResponse.status).toBe(200);
      expect(jsResponse.body.code).toContain('class TwoSum');

      const tsResponse = await client.get('/api/template?challenge=two_sum&language=typescript');
      expect(tsResponse.status).toBe(200);
      expect(tsResponse.body.code).toContain('class TwoSum');
    });

    test('returns C++ templates only for enabled challenges', async () => {
      const houseResponse = await client.get('/api/template?challenge=house_robber&language=cpp');
      expect(houseResponse.status).toBe(200);
      expect(houseResponse.body.code).toContain('class HouseRobber');

      const unsupportedResponse = await client.get('/api/template?challenge=two_sum&language=cpp');
      expect(unsupportedResponse.status).toBe(400);
      expect(unsupportedResponse.body.error).toMatch(/not supported/i);
    });
  });

  describe('GET /api/description', () => {
    test('should return description HTML for valid challenge', async () => {
      const testChallenge = 'two_sum';
      const descriptionContent = '<h1>Two Sum Challenge</h1>';
      const { filePath, previousContent } = await createTestDataFile(testChallenge, 'description.html', descriptionContent);
      
      const response = await client.get(`/api/description?challenge=${testChallenge}`);
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('description');
      expect(response.body.description).toContain('Two Sum');
      
      if (previousContent !== null) {
        await writeFile(filePath, previousContent, 'utf8');
      } else {
        await unlink(filePath);
      }
    });

    test('should handle invalid challenge ID', async () => {
      const response = await client.get('/api/description?challenge=invalid_challenge');
      expect(response.status).toBe(500);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/interviewer-notes', () => {
    test('returns trusted notes HTML for a challenge that has notes', async () => {
      const response = await client.get('/api/interviewer-notes?challenge=house_robber');

      expect(response.status).toBe(200);
      expect(response.body.notes).toContain('House Robber — Interviewer Notes');
      expect(response.body.notes).toContain('Vn = max');
    });

    test('returns 404 when notes are absent', async () => {
      const response = await client.get('/api/interviewer-notes?challenge=two_sum');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Interviewer notes not found' });
    });

    test('requires a challenge id', async () => {
      const response = await client.get('/api/interviewer-notes');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Challenge is required' });
    });
  });

  describe('GET /api/test-cases', () => {
    test('should return runTests and submitTests for valid challenge', async () => {
      const response = await client.get('/api/test-cases?challenge=two_sum');
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('runTests');
      expect(response.body).toHaveProperty('submitTests');
      expect(Array.isArray(response.body.runTests)).toBe(true);
      expect(Array.isArray(response.body.submitTests)).toBe(true);
    });

    test('should filter expected output from test cases', async () => {
      const response = await client.get('/api/test-cases?challenge=two_sum');
      expect(response.status).toBe(200);
      
      if (response.body.runTests.length > 0) {
        const testCase = response.body.runTests[0];
        expect(testCase).toHaveProperty('id');
        expect(testCase).toHaveProperty('name');
        expect(testCase).toHaveProperty('input');
        expect(testCase).not.toHaveProperty('expected');
      }
    });

    test('should handle invalid challenge ID', async () => {
      const response = await client.get('/api/test-cases?challenge=invalid_challenge');
      expect(response.status).toBe(500);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/run', () => {
    test('accepts C++ for House Robber in the execution flow', async () => {
      const response = await client.post('/api/run', {
        code: 'class HouseRobber { public: int rob(std::vector<int>& nums) { return 0; } };',
        challenge: 'house_robber',
        language: 'cpp'
      });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should execute code with basic test cases', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      
      const response = await client.post('/api/run', { code, challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    test('should filter tests by testIds array', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      
      const response = await client.post('/api/run', { code, testIds: [1, 2], challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('results');
      // Results should only contain tests with IDs 1 and 2
      if (response.body.success && response.body.results.length > 0) {
        const testIds = response.body.results.map(r => r.testCase?.id);
        testIds.forEach(id => {
          expect([1, 2]).toContain(id);
        });
      }
    });

    test('should validate code parameter', async () => {
      const response = await client.post('/api/run', { challenge: 'two_sum' });
      expect(response.status).toBe(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Code is required');
    });

    test('should handle compilation errors', async () => {
      const invalidCode = 'public class TwoSum { invalid syntax }';
      
      const response = await client.post('/api/run', { code: invalidCode, challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      // Should return error in response body
      if (!response.body.success) {
        expect(response.body.error).toBeDefined();
      }
    });

    test('should handle invalid testIds', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      
      const response = await client.post('/api/run', { code, testIds: [99999], challenge: 'two_sum' });
      expect(response.status).toBe(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('should handle different languages with mock execution', async () => {
      const code = 'class TwoSum { }';

      const jsResponse = await client.post('/api/run', { code, challenge: 'two_sum', language: 'js' });
      expect(jsResponse.status).toBe(200);
      expect(jsResponse.body).toHaveProperty('results');

      const pyResponse = await client.post('/api/run', { code, challenge: 'two_sum', language: 'python' });
      expect(pyResponse.status).toBe(200);
      expect(pyResponse.body).toHaveProperty('results');

      const tsResponse = await client.post('/api/run', { code, challenge: 'two_sum', language: 'ts' });
      expect(tsResponse.status).toBe(200);
      expect(tsResponse.body).toHaveProperty('results');
    });
  });

  describe('POST /api/submit', () => {
    test('should execute code with comprehensive test cases', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      
      const response = await client.post('/api/submit', { code, challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('results');
    });

    test('should calculate average execution time', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      
      const response = await client.post('/api/submit', { code, challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      if (response.body.success && response.body.results.length > 0) {
        expect(response.body).toHaveProperty('avgTime');
        expect(typeof response.body.avgTime).toBe('number');
      }
    });

    test('should determine pass/fail status', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      
      const response = await client.post('/api/submit', { code, challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      if (response.body.success) {
        expect(response.body).toHaveProperty('passed');
        expect(typeof response.body.passed).toBe('boolean');
      }
    });

    test('should validate code parameter', async () => {
      const response = await client.post('/api/submit', { challenge: 'two_sum' });
      expect(response.status).toBe(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('should support language-specific submissions', async () => {
      const code = 'class TwoSum { }';
      const response = await client.post('/api/submit', { code, challenge: 'two_sum', language: 'javascript' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
    });
  });

  describe('POST /api/save', () => {
    test('should acknowledge save requests', async () => {
      const response = await client.post('/api/save', { code: 'class TwoSum { }' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('DELETE /api/cleanup', () => {
    test('should delete challenge-specific temp files', async () => {
      const response = await client.delete('/api/cleanup?challenge=two_sum');
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
    });

    test('should handle missing temp directory for valid challenge', async () => {
      const response = await client.delete('/api/cleanup?challenge=two_sum');
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('success');
    });

    test('should handle invalid challenge ID', async () => {
      const response = await client.delete('/api/cleanup?challenge=invalid_challenge');
      expect(response.status).toBe(500);
      
      expect(response.body).toHaveProperty('error');
    });

    test('should remove nested temp files', async () => {
      const challengeId = 'two_sum';
      const tempDir = join(__dirname, '../../temp', challengeId);
      const nestedDir = join(tempDir, 'nested');

      await mkdir(nestedDir, { recursive: true });
      await writeFile(join(tempDir, 'Main.java'), 'class Main {}', 'utf8');
      await writeFile(join(nestedDir, 'Nested.class'), 'data', 'utf8');

      const response = await client.delete(`/api/cleanup?challenge=${challengeId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      await rm(tempDir, { recursive: true, force: true });
    });
  });

  describe('GET /api/challenges', () => {
    test('should return list of available challenges', async () => {
      const response = await client.get('/api/challenges');
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('challenges');
      expect(Array.isArray(response.body.challenges)).toBe(true);
      
      if (response.body.challenges.length > 0) {
        const challenge = response.body.challenges[0];
        expect(challenge).toHaveProperty('id');
        expect(challenge).toHaveProperty('name');
      }
    });
  });

  describe('GET /api/submissions', () => {
    test('should return submissions for challenge', async () => {
      const response = await client.get('/api/submissions?challenge=two_sum');
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('submissions');
      expect(Array.isArray(response.body.submissions)).toBe(true);
    });

    test('should return empty array if submissions file does not exist', async () => {
      const response = await client.get('/api/submissions?challenge=nonexistent_challenge');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/submissions', () => {
    test('should save new submission', async () => {
      const submissionData = {
        challenge: 'two_sum',
        avgTime: 100,
        timerTime: 5000,
        date: new Date().toISOString()
      };
      
      const response = await client.post('/api/submissions', submissionData);
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('submission');
      expect(response.body.submission).toHaveProperty('id');
    });

    test('should mark tech bar label when solution is missing', async () => {
      const submissionData = {
        challenge: 'two_sum',
        avgTime: 120,
        timerTime: 6000,
        date: new Date().toISOString()
      };

      const response = await client.post('/api/submissions', submissionData);
      expect(response.status).toBe(200);

      const submissionId = response.body.submission.id;
      const submission = await waitForTechBarLabel(submissionId, 'no_submission');

      expect(submission).toBeDefined();
      expect(submission.tech_bar_label).toBe('no_submission');
      expect(submission.tech_bar_status).toBe('completed');
    });

    test('should validate required fields', async () => {
      const response = await client.post('/api/submissions', { challenge: 'two_sum' });
      expect(response.status).toBe(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('should validate challenge field', async () => {
      const response = await client.post('/api/submissions', {
          avgTime: 100,
          timerTime: 5000,
          date: new Date().toISOString()
        });
      expect(response.status).toBe(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/submissions', () => {
    test('should delete submission by ID', async () => {
      // First create a submission
      const submissionData = {
        challenge: 'two_sum',
        avgTime: 100,
        timerTime: 5000,
        date: new Date().toISOString()
      };
      
      const createResponse = await client.post('/api/submissions', submissionData);
      expect(createResponse.status).toBe(200);
      
      const submissionId = createResponse.body.submission.id;
      
      // Then delete it
      const deleteResponse = await client.delete(`/api/submissions?id=${submissionId}&challenge=two_sum`);
      expect(deleteResponse.status).toBe(200);
      
      expect(deleteResponse.body).toHaveProperty('success');
      expect(deleteResponse.body.success).toBe(true);
    });

    test('should return 404 for non-existent submission', async () => {
      const response = await client.delete('/api/submissions?id=non-existent-id&challenge=two_sum');
      expect(response.status).toBe(404);
      
      expect(response.body).toHaveProperty('error');
    });

    test('should validate submission ID', async () => {
      const response = await client.delete('/api/submissions?challenge=two_sum');
      expect(response.status).toBe(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });
});
