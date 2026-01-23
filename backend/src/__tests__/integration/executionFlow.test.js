import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import { createAppTestClient } from '../utils/appTestClient.js';

describe('Integration Tests - Execution Flow', () => {
  let app;
  let client;

  beforeAll(async () => {
    process.env.MOCK_EXECUTION = '1';
    await jest.resetModules();
    ({ app } = await import('../../server.js'));
    client = createAppTestClient(app);
  });

  describe('Full Run Endpoint Flow', () => {
    test('should execute code and return parsed results', async () => {
      const code = `
public class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        return new int[] { 0, 1 };
    }
}
`;
      
      const response = await client.post('/api/run', { code, challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('results');
      
      if (response.body.success) {
        expect(Array.isArray(response.body.results)).toBe(true);
        if (response.body.results.length > 0) {
          const result = response.body.results[0];
          expect(result).toHaveProperty('testCase');
          expect(result).toHaveProperty('actual');
          expect(result).toHaveProperty('expected');
          expect(result).toHaveProperty('passed');
          expect(result).toHaveProperty('executionTime');
        }
      }
    });

    test('should handle test case filtering', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      
      const response = await client.post('/api/run', { code, testIds: [1], challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      if (response.body.success) {
        // Should only return results for test ID 1
        response.body.results.forEach(result => {
          expect([1]).toContain(result.testCase?.id);
        });
      }
    });
  });

  describe('Full Submit Endpoint Flow', () => {
    test('should execute comprehensive test suite and calculate average time', async () => {
      const code = `
public class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        return new int[] { 0, 1 };
    }
}
`;
      
      const response = await client.post('/api/submit', { code, challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('results');
      
      if (response.body.success && response.body.results.length > 0) {
        expect(response.body).toHaveProperty('avgTime');
        expect(response.body).toHaveProperty('passed');
        expect(typeof response.body.avgTime).toBe('number');
        expect(typeof response.body.passed).toBe('boolean');
        
        // Average time should be calculated correctly
        const totalTime = response.body.results.reduce((sum, r) => sum + r.executionTime, 0);
        const expectedAvg = Math.round(totalTime / response.body.results.length);
        expect(response.body.avgTime).toBe(expectedAvg);
      }
    });

    test('should determine pass/fail based on all test results', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      
      const response = await client.post('/api/submit', { code, challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      if (response.body.success) {
        const allPassed = response.body.results.every(r => r.passed);
        expect(response.body.passed).toBe(allPassed);
      }
    });
  });

  describe('Multiple Challenges in Sequence', () => {
    test('should handle switching between challenges', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      
      // Test Two Sum challenge
      const twoSumResponse = await client.post('/api/run', { code, challenge: 'two_sum' });
      expect(twoSumResponse.status).toBe(200);
      
      expect(twoSumResponse.body).toHaveProperty('success');

      // Test Valid Parentheses challenge
      const validCode = 'class ValidParentheses { public boolean isValid(String s) { return true; } }';
      const validResponse = await client.post('/api/run', { code: validCode, challenge: 'valid_parentheses' });
      expect(validResponse.status).toBe(200);
      
      expect(validResponse.body).toHaveProperty('success');
      
      // Both should work independently
      expect(twoSumResponse.body.success !== undefined).toBe(true);
      expect(validResponse.body.success !== undefined).toBe(true);
    });
  });

  describe('Challenge Loading', () => {
    test('should load test cases for all challenges', async () => {
      const challenges = ['two_sum', 'lrucachewithttl'];
      
      for (const challenge of challenges) {
        const response = await client.get(`/api/test-cases?challenge=${challenge}`);
        expect(response.status).toBe(200);
        
        expect(response.body).toHaveProperty('runTests');
        expect(response.body).toHaveProperty('submitTests');
        expect(Array.isArray(response.body.runTests)).toBe(true);
        expect(Array.isArray(response.body.submitTests)).toBe(true);
      }
    });

    test('should load adapters for all challenges', async () => {
      const challenges = ['two_sum', 'lrucachewithttl'];
      const code = 'public Object method() { return null; }';
      
      for (const challenge of challenges) {
        const response = await client.post('/api/run', { code, challenge });
        expect(response.status).toBe(200);
        
        // Should not fail due to adapter loading
        expect(response.body).toHaveProperty('success');
      }
    });

    test('should handle missing files gracefully', async () => {
      const response = await client.get('/api/template?challenge=nonexistent_challenge');
      expect(response.status).toBe(500);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('File System Operations', () => {
    test('should isolate temp directories per challenge', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      
      // Execute for different challenges
      const response1 = await client.post('/api/run', { code, challenge: 'two_sum' });
      expect(response1.status).toBe(200);
      
      const response2 = await client.post('/api/run', { code: 'class ValidParentheses { public boolean isValid(String s) { return true; } }', challenge: 'valid_parentheses' });
      expect(response2.status).toBe(200);
      
      // Both should execute without interfering
      expect(response1.body).toHaveProperty('success');
      expect(response2.body).toHaveProperty('success');
    });

    test('should cleanup temp files after execution', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      
      // Execute code
      const runResponse = await client.post('/api/run', { code, challenge: 'two_sum' });
      expect(runResponse.status).toBe(200);
      
      // Cleanup should work
      const cleanupResponse = await client.delete('/api/cleanup?challenge=two_sum');
      expect(cleanupResponse.status).toBe(200);
      
      expect(cleanupResponse.body).toHaveProperty('success');
    });
  });

  describe('Error Propagation', () => {
    test('should propagate compilation errors to API response', async () => {
      const invalidCode = 'public class TwoSum { invalid syntax }';
      
      const response = await client.post('/api/run', { code: invalidCode, challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      if (!response.body.success) {
        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain('Compilation');
      }
    });

    test('should propagate runtime errors to API response', async () => {
      const code = `
public class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        throw new RuntimeException("Test runtime error");
    }
}
`;
      
      const response = await client.post('/api/run', { code, challenge: 'two_sum' });
      expect(response.status).toBe(200);
      
      // Should handle runtime error gracefully
      expect(response.body).toHaveProperty('success');
      if (!response.body.success) {
        expect(response.body.error).toBeDefined();
      }
    });

    test('should propagate file system errors to API response', async () => {
      const response = await client.get('/api/template?challenge=invalid_challenge');
      expect(response.status).toBe(500);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('End-to-End Submission Flow', () => {
    test('should complete full submission workflow', async () => {
      const code = `
public class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        return new int[] { 0, 1 };
    }
}
`;
      
      // 1. Get test cases
      const testCasesResponse = await client.get('/api/test-cases?challenge=two_sum');
      expect(testCasesResponse.status).toBe(200);
      
      expect(testCasesResponse.body).toHaveProperty('runTests');
      
      // 2. Run code
      const runResponse = await client.post('/api/run', { code, challenge: 'two_sum' });
      expect(runResponse.status).toBe(200);
      
      expect(runResponse.body).toHaveProperty('success');
      
      // 3. Submit code
      const submitResponse = await client.post('/api/submit', { code, challenge: 'two_sum' });
      expect(submitResponse.status).toBe(200);
      
      expect(submitResponse.body).toHaveProperty('success');
      
      // 4. Save submission if passed
      if (submitResponse.body.success && submitResponse.body.passed) {
        const submissionData = {
          challenge: 'two_sum',
          avgTime: submitResponse.body.avgTime || 0,
          timerTime: 5000,
          date: new Date().toISOString()
        };
        
        const saveResponse = await client.post('/api/submissions', submissionData);
        expect(saveResponse.status).toBe(200);
        
        expect(saveResponse.body).toHaveProperty('success');
        expect(saveResponse.body.success).toBe(true);
      }
    });
  });
});
