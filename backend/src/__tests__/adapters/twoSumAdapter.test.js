import { describe, test, expect } from '@jest/globals';
import { createStandardAdapter } from '../../adapters/standardAdapterFactory.js';
import { standardAdapterDefinitions } from '../../adapters/standardAdapterDefinitions.js';
import { twoSumTestCases } from '../utils/fixtures.js';

const twoSumAdapter = createStandardAdapter(standardAdapterDefinitions.twoSum, 'java');

describe('Two Sum Adapter', () => {
  describe('extractInput', () => {
    test('should extract nums and target from test case', () => {
      const testCase = { nums: [2, 7, 11, 15], target: 9 };
      const result = twoSumAdapter.extractInput(testCase);
      expect(result).toEqual({ nums: [2, 7, 11, 15], target: 9 });
    });

    test('should handle missing nums field', () => {
      const testCase = { target: 5 };
      const result = twoSumAdapter.extractInput(testCase);
      expect(result).toEqual({ nums: [], target: 5 });
    });

    test('should handle missing target field', () => {
      const testCase = { nums: [1, 2, 3] };
      const result = twoSumAdapter.extractInput(testCase);
      expect(result).toEqual({ nums: [1, 2, 3], target: 0 });
    });

    test('should handle empty test case', () => {
      const testCase = {};
      const result = twoSumAdapter.extractInput(testCase);
      expect(result).toEqual({ nums: [], target: 0 });
    });
  });

  describe('buildExpectedCode', () => {
    test('should build code for null array', () => {
      const result = twoSumAdapter.buildExpectedCode(null);
      expect(result).toContain('int[] expected = null');
    });

    test('should build code for expected array', () => {
      const expected = [0, 1];
      const result = twoSumAdapter.buildExpectedCode(expected);
      expect(result).toContain('int[] expected = new int[] { 0, 1 }');
    });
  });

  describe('generateSerializer', () => {
    test('should generate serializer method', () => {
      const result = twoSumAdapter.generateSerializer();
      expect(result).toContain('serializeIntArray');
      expect(result).toContain('int[] arr');
    });
  });

  describe('generateInvocation', () => {
    test('should generate invocation code with parser variable', () => {
      const result = twoSumAdapter.generateInvocation('parser');
      expect(result).toContain('parser.twoSum');
      expect(result).toContain('getTestNums(i)');
      expect(result).toContain('getTestTarget(i)');
    });
  });

  describe('generateInputHelpers', () => {
    test('should generate nums and target helper methods', () => {
      const result = twoSumAdapter.generateInputHelpers(twoSumTestCases);
      expect(result).toContain('getTestNums');
      expect(result).toContain('getTestTarget');
      expect(result).toContain('int[][] inputs');
      expect(result).toContain('int[] targets');
    });

    test('should include all test case inputs', () => {
      const result = twoSumAdapter.generateInputHelpers(twoSumTestCases);
      expect(result).toContain('2, 7, 11, 15');
      expect(result).toContain('9');
    });
  });

  describe('getReturnType', () => {
    test('should return int[]', () => {
      expect(twoSumAdapter.getReturnType()).toBe('int[]');
    });
  });

  describe('getSerializerMethod', () => {
    test('should return serializeIntArray', () => {
      expect(twoSumAdapter.getSerializerMethod()).toBe('serializeIntArray');
    });
  });
});
