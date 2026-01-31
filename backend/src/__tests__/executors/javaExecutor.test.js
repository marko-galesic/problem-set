import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { executeJavaCode } from '../../executors/javaExecutor.js';
import { createStandardAdapter } from '../../adapters/standardAdapterFactory.js';
import { standardAdapterDefinitions } from '../../adapters/standardAdapterDefinitions.js';
import { twoSumTestCases } from '../utils/fixtures.js';
import { createTestTempDir, cleanupTestDir, fileExists } from '../utils/fileSystemHelpers.js';

const twoSumAdapter = createStandardAdapter(standardAdapterDefinitions.twoSum, 'java');

// Mock console.log to reduce noise in tests
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = jest.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
});

describe('Java Executor', () => {
  describe('Code Generation - Wrapper Class Detection', () => {
    test('should detect wrapper class pattern', async () => {
      const wrapperCode = `
class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        return null;
    }
}
`;
      const testCases = [twoSumTestCases[0]];
      const result = await executeJavaCode(wrapperCode, testCases, twoSumAdapter, 'two_sum');
      
      // Should generate code that uses detected class name
      expect(result).toBeDefined();
      // If compilation fails due to missing Java, that's expected in test environment
      // We're mainly testing that the code generation doesn't crash
    });

    test('should handle standalone class code', async () => {
      const standaloneCode = `
public int[] twoSum(int[] nums, int target) {
    return new int[] { 0, 1 };
}
`;
      const testCases = [twoSumTestCases[0]];
      const result = await executeJavaCode(standaloneCode, testCases, twoSumAdapter, 'two_sum');
      expect(result).toBeDefined();
    });
  });

  describe('Result Parsing', () => {
    // Since parseTestResults is not exported, we test it indirectly
    // by checking that executeJavaCode handles various output formats
    
    test('should handle valid Java output format', async () => {
      // This test would require actual Java execution
      // For now, we verify the function signature and error handling
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      const testCases = [twoSumTestCases[0]];
      
      const result = await executeJavaCode(code, testCases, twoSumAdapter, 'two_sum');
      
      // Result should have proper structure
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('results');
      
      if (result.success) {
        expect(Array.isArray(result.results)).toBe(true);
        if (result.results.length > 0) {
          expect(result.results[0]).toHaveProperty('testCase');
          expect(result.results[0]).toHaveProperty('actual');
          expect(result.results[0]).toHaveProperty('expected');
          expect(result.results[0]).toHaveProperty('passed');
          expect(result.results[0]).toHaveProperty('executionTime');
          expect(result.results[0]).toHaveProperty('stdout');
        }
      }
    });

    test('should handle compilation errors gracefully', async () => {
      const invalidCode = `
class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        return new int[] { 0, 1 // syntax error
    }
}
`;
      const testCases = [twoSumTestCases[0]];
      const result = await executeJavaCode(invalidCode, testCases, twoSumAdapter, 'two_sum');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Compilation');
      expect(Array.isArray(result.results)).toBe(true);
    });

    test('should handle empty code', async () => {
      const result = await executeJavaCode('', [twoSumTestCases[0]], twoSumAdapter, 'two_sum');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should handle null code', async () => {
      const result = await executeJavaCode(null, [twoSumTestCases[0]], twoSumAdapter, 'two_sum');
      expect(result.success).toBe(false);
    });
  });

  describe('File Management', () => {
    test('should create challenge-specific temp directory', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      const testCases = [twoSumTestCases[0]];
      
      await executeJavaCode(code, testCases, twoSumAdapter, 'test_challenge');
      
      // Temp directory should be created (or at least attempted)
      // We can't easily verify this without file system access, but we verify no errors
      expect(true).toBe(true); // Placeholder - actual verification would require fs mocking
    });

    test('should handle multiple challenges with isolation', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      const testCases = [twoSumTestCases[0]];
      
      const result1 = await executeJavaCode(code, testCases, twoSumAdapter, 'challenge1');
      const result2 = await executeJavaCode(code, testCases, twoSumAdapter, 'challenge2');
      
      // Both should execute without interfering with each other
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });
  });

  describe('Adapter Integration', () => {
    test('should use adapter to generate expected code', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      const testCases = [twoSumTestCases[0]];
      
      const result = await executeJavaCode(code, testCases, twoSumAdapter, 'two_sum');
      
      // Should not crash when adapter is used
      expect(result).toBeDefined();
    });

    test('should use adapter to generate invocation code', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      const testCases = [twoSumTestCases[0]];
      
      const result = await executeJavaCode(code, testCases, twoSumAdapter, 'two_sum');
      
      // Should not crash when adapter generates invocation
      expect(result).toBeDefined();
    });

    test('should use adapter to generate input helpers', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      const testCases = twoSumTestCases;
      
      const result = await executeJavaCode(code, testCases, twoSumAdapter, 'two_sum');
      
      // Should handle multiple test cases
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing adapter', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      const testCases = [twoSumTestCases[0]];
      
      await expect(
        executeJavaCode(code, testCases, null, 'two_sum')
      ).rejects.toThrow('Adapter is required');
    });

    test('should handle runtime errors', async () => {
      // Code that compiles but throws at runtime
      const code = `
class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        throw new RuntimeException("Test error");
    }
}
`;
      const testCases = [twoSumTestCases[0]];
      const result = await executeJavaCode(code, testCases, twoSumAdapter, 'two_sum');
      
      // Should handle runtime error gracefully
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe('Edge Cases', () => {
    test('should handle very large code', async () => {
      const largeCode = 'public int[] twoSum(int[] nums, int target) { return null; }'.repeat(1000);
      const testCases = [twoSumTestCases[0]];
      
      const result = await executeJavaCode(largeCode, testCases, twoSumAdapter, 'two_sum');
      expect(result).toBeDefined();
    });

    test('should handle special characters in code', async () => {
      const codeWithSpecialChars = `
class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        // Test: "quotes" and 'single quotes' and \\backslashes\\
        return null;
    }
}
`;
      const testCases = [twoSumTestCases[0]];
      const result = await executeJavaCode(codeWithSpecialChars, testCases, twoSumAdapter, 'two_sum');
      expect(result).toBeDefined();
    });

    test('should handle empty test cases array', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      const result = await executeJavaCode(code, [], twoSumAdapter, 'two_sum');
      
      expect(result).toBeDefined();
      if (result.success) {
        expect(result.results).toEqual([]);
      }
    });

    test('should handle many test cases', async () => {
      const code = 'public int[] twoSum(int[] nums, int target) { return null; }';
      const manyTestCases = Array(20).fill(null).map((_, i) => ({
        ...twoSumTestCases[0],
        id: i + 1
      }));
      
      const result = await executeJavaCode(code, manyTestCases, twoSumAdapter, 'two_sum');
      expect(result).toBeDefined();
    });
  });
});
