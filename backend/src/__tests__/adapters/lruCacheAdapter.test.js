import { describe, test, expect } from '@jest/globals';
import lruCacheAdapter from '../../adapters/lruCacheAdapter.js';
import { lruCacheTestCases } from '../utils/fixtures.js';

describe('LRU Cache Adapter', () => {
  describe('extractInput', () => {
    test('should extract capacity, ttlMillis, and steps', () => {
      const testCase = {
        capacity: 2,
        ttlMillis: 5000,
        steps: [{ op: 'put', args: [1, 1] }]
      };
      const result = lruCacheAdapter.extractInput(testCase);
      expect(result).toEqual({
        capacity: 2,
        ttlMillis: 5000,
        steps: [{ op: 'put', args: [1, 1] }]
      });
    });

    test('should use default capacity when missing', () => {
      const testCase = { steps: [] };
      const result = lruCacheAdapter.extractInput(testCase);
      expect(result.capacity).toBe(2);
    });

    test('should use null ttlMillis when missing', () => {
      const testCase = { capacity: 3, steps: [] };
      const result = lruCacheAdapter.extractInput(testCase);
      expect(result.ttlMillis).toBe(null);
    });

    test('should use empty array for steps when missing', () => {
      const testCase = { capacity: 2 };
      const result = lruCacheAdapter.extractInput(testCase);
      expect(result.steps).toEqual([]);
    });
  });

  describe('buildExpectedCode', () => {
    test('should build code for integer expected value', () => {
      const result = lruCacheAdapter.buildExpectedCode(42);
      expect(result).toContain('Integer expected = 42');
    });

    test('should build code for null expected value', () => {
      const result = lruCacheAdapter.buildExpectedCode(null);
      expect(result).toContain('Integer expected = -1');
    });

    test('should build code for undefined expected value', () => {
      const result = lruCacheAdapter.buildExpectedCode(undefined);
      expect(result).toContain('Integer expected = -1');
    });

    test('should build code for zero expected value', () => {
      const result = lruCacheAdapter.buildExpectedCode(0);
      expect(result).toContain('Integer expected = 0');
    });

    test('should build code for negative expected value', () => {
      const result = lruCacheAdapter.buildExpectedCode(-1);
      expect(result).toContain('Integer expected = -1');
    });
  });

  describe('generateSerializer', () => {
    test('should generate serializer method', () => {
      const result = lruCacheAdapter.generateSerializer();
      expect(result).toContain('serializeResult');
      expect(result).toContain('Integer result');
      expect(result).toContain('String.valueOf(result)');
    });

    test('should handle null result', () => {
      const result = lruCacheAdapter.generateSerializer();
      expect(result).toContain('result == null ? "null"');
    });
  });

  describe('generateInvocation', () => {
    test('should generate invocation code with cache variable', () => {
      const result = lruCacheAdapter.generateInvocation('cache');
      expect(result).toContain('LRUCache cache = new LRUCache');
      expect(result).toContain('getTestCapacity(i)');
      expect(result).toContain('getTestTTL(i)');
      expect(result).toContain('getTestSteps(i)');
    });

    test('should include TestClock reset', () => {
      const result = lruCacheAdapter.generateInvocation('cache');
      expect(result).toContain('TestClock.reset()');
    });

    test('should include time control logic', () => {
      const result = lruCacheAdapter.generateInvocation('cache');
      expect(result).toContain('hasTimeControl');
      expect(result).toContain('step.at');
      expect(result).toContain('TestClock.setCurrentTime');
    });

    test('should include step execution', () => {
      const result = lruCacheAdapter.generateInvocation('cache');
      expect(result).toContain('"put".equals(step.op)');
      expect(result).toContain('"get".equals(step.op)');
      expect(result).toContain('cache.put');
      expect(result).toContain('cache.get');
    });
  });

  describe('generateInputHelpers', () => {
    test('should generate Step class', () => {
      const result = lruCacheAdapter.generateInputHelpers(lruCacheTestCases);
      expect(result).toContain('static class Step');
      expect(result).toContain('String op');
      expect(result).toContain('int[] args');
      expect(result).toContain('Long at');
    });

    test('should generate capacity helper', () => {
      const result = lruCacheAdapter.generateInputHelpers(lruCacheTestCases);
      expect(result).toContain('getTestCapacity');
      expect(result).toContain('int[] capacities');
    });

    test('should generate TTL helper', () => {
      const result = lruCacheAdapter.generateInputHelpers(lruCacheTestCases);
      expect(result).toContain('getTestTTL');
      expect(result).toContain('long[] ttls');
    });

    test('should generate steps helper', () => {
      const result = lruCacheAdapter.generateInputHelpers(lruCacheTestCases);
      expect(result).toContain('getTestSteps');
      expect(result).toContain('List<Step>');
    });

    test('should include step creation with time control', () => {
      const testCases = [
        {
          id: 1,
          capacity: 2,
          steps: [
            { op: 'put', args: [1, 1], at: 1000 },
            { op: 'get', args: [1], at: 2000, expected: 1 }
          ]
        }
      ];
      const result = lruCacheAdapter.generateInputHelpers(testCases);
      expect(result).toContain('new Step("put"');
      expect(result).toContain('1000L');
      expect(result).toContain('null');
    });

    test('should handle empty steps', () => {
      const testCases = [{ id: 1, capacity: 2, steps: [] }];
      const result = lruCacheAdapter.generateInputHelpers(testCases);
      expect(result).toContain('Collections.emptyList()');
    });
  });

  describe('checkUserDefinedClasses', () => {
    test('should detect LRUCache class', () => {
      const code = 'class LRUCache { }';
      const result = lruCacheAdapter.checkUserDefinedClasses(code);
      expect(result.hasLRUCache).toBe(true);
    });

    test('should return false when not defined', () => {
      const code = 'public void method() { }';
      const result = lruCacheAdapter.checkUserDefinedClasses(code);
      expect(result.hasLRUCache).toBe(false);
    });

    test('should handle null/undefined code', () => {
      expect(lruCacheAdapter.checkUserDefinedClasses(null)).toEqual({
        hasLRUCache: false
      });
    });
  });

  describe('generateHelperClasses', () => {
    test('should not generate helper classes (TestClock is top-level)', () => {
      const hasUserDefined = { hasLRUCache: false };
      const result = lruCacheAdapter.generateHelperClasses(hasUserDefined);
      expect(result).toBe('');
    });
  });

  describe('getReturnType', () => {
    test('should return Integer', () => {
      expect(lruCacheAdapter.getReturnType()).toBe('Integer');
    });
  });

  describe('getSerializerMethod', () => {
    test('should return serializeResult', () => {
      expect(lruCacheAdapter.getSerializerMethod()).toBe('serializeResult');
    });
  });

  describe('preprocessTestCases', () => {
    test('should extract expected from last get step', () => {
      const testCases = [
        {
          id: 1,
          steps: [
            { op: 'put', args: [1, 1] },
            { op: 'get', args: [1], expected: 9 }
          ]
        }
      ];
      const processed = lruCacheAdapter.preprocessTestCases(testCases);
      expect(processed[0].expected).toBe(9);
    });

    test('should default expected to -1 when no get step', () => {
      const testCases = [{ id: 1, steps: [{ op: 'put', args: [1, 1] }] }];
      const processed = lruCacheAdapter.preprocessTestCases(testCases);
      expect(processed[0].expected).toBe(-1);
    });
  });

  describe('transformUserCode', () => {
    test('should replace System.currentTimeMillis when time control is used', () => {
      const code = 'long now = System.currentTimeMillis();';
      const testCases = [{ steps: [{ op: 'get', args: [1], at: 10, expected: 1 }] }];
      const result = lruCacheAdapter.transformUserCode(code, testCases);
      expect(result).toContain('TestClock.currentTimeMillis()');
    });

    test('should return original code when time control is not used', () => {
      const code = 'long now = System.currentTimeMillis();';
      const testCases = [{ steps: [{ op: 'get', args: [1], expected: 1 }] }];
      const result = lruCacheAdapter.transformUserCode(code, testCases);
      expect(result).toBe(code);
    });
  });
});
