import { describe, test, expect, beforeEach } from '@jest/globals';
import { loadAdapter, clearCache } from '../../adapters/index.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { initDatabase } from '../../db/database.js';
import { insertChallenge, upsertChallengeAdapterDefinition } from '../../db/queries.js';
import { standardAdapterDefinitions } from '../../adapters/standardAdapterDefinitions.js';
import { createStandardAdapter } from '../../adapters/standardAdapterFactory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Adapter Registry', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('loadAdapter', () => {
    test('should load Two Sum adapter', async () => {
      const adapter = await loadAdapter('standard:twoSum:java');
      expect(adapter).toBeDefined();
      expect(adapter.getReturnType).toBeDefined();
      expect(adapter.getReturnType()).toBe('int[]');
    });

    test('should load LRU Cache adapter', async () => {
      const adapter = await loadAdapter('./adapters/lruCacheAdapter.js');
      expect(adapter).toBeDefined();
      expect(adapter.getReturnType).toBeDefined();
      expect(adapter.getReturnType()).toBe('Integer');
    });

    test('should cache loaded adapters', async () => {
      const adapter1 = await loadAdapter('standard:twoSum:java');
      const adapter2 = await loadAdapter('standard:twoSum:java');
      expect(adapter1).toBe(adapter2); // Same instance
    });

    test('should handle adapter path with ./ prefix', async () => {
      const adapter = await loadAdapter('./adapters/lruCacheAdapter.js');
      expect(adapter).toBeDefined();
    });

    test('should load module without default export via file url', async () => {
      const adapterUrl = pathToFileURL(join(__dirname, '../../adapters/index.js')).href;
      const adapter = await loadAdapter(adapterUrl);
      expect(adapter).toBeDefined();
      expect(adapter.loadAdapter).toBeDefined();
    });

    test('should load db-standard adapter definitions', async () => {
      const challengeId = 'db_standard_two_sum';

      initDatabase();
      insertChallenge({
        id: challengeId,
        name: 'DB Standard Two Sum',
        folder: 'two_sum',
        test_file: './testCases/twoSumTests.js',
        adapter: 'standard:twoSum:java',
        difficulty: null,
        topics: []
      });
      upsertChallengeAdapterDefinition(challengeId, standardAdapterDefinitions.twoSum);

      const adapter = await loadAdapter(`db-standard:${challengeId}:java`);
      expect(adapter).toBeDefined();
      expect(adapter.getReturnType()).toBe('int[]');
      expect(adapter.extractInput({ nums: [1, 2], target: 3 })).toEqual({
        nums: [1, 2],
        target: 3
      });
    });

    test('should load standard adapter definitions by key', async () => {
      const adapter = await loadAdapter('standard:twoSum:java');
      expect(adapter).toBeDefined();
      expect(adapter.getReturnType()).toBe('int[]');
      expect(adapter.extractInput({ nums: [1, 2], target: 3 })).toEqual({
        nums: [1, 2],
        target: 3
      });
    });

    test('should load standard adapter definitions for python', async () => {
      const adapter = await loadAdapter('standard:twoSum:python');
      expect(adapter).toBeDefined();
      expect(adapter.getReturnType()).toBe('list[int]');
    });

    test('should load standard adapter definitions for typescript', async () => {
      const adapter = await loadAdapter('standard:twoSum:typescript');
      expect(adapter).toBeDefined();
      expect(adapter.getReturnType()).toBe('number[]');
    });

    test('standard adapter path should match factory output', async () => {
      const factoryAdapter = createStandardAdapter(standardAdapterDefinitions.twoSum, 'java');
      const standardAdapter = await loadAdapter('standard:twoSum:java');
      const sampleTestCases = [
        { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
        { nums: [3, 2, 4], target: 6, expected: [1, 2] }
      ];
      const sample = sampleTestCases[0];

      expect(standardAdapter.extractInput(sample)).toEqual(factoryAdapter.extractInput(sample));
      expect(standardAdapter.buildExpectedCode(sample.expected)).toBe(
        factoryAdapter.buildExpectedCode(sample.expected)
      );
      expect(standardAdapter.generateSerializer()).toBe(factoryAdapter.generateSerializer());
      expect(standardAdapter.generateInvocation('solver')).toBe(
        factoryAdapter.generateInvocation('solver')
      );
      expect(standardAdapter.generateInputHelpers(sampleTestCases)).toBe(
        factoryAdapter.generateInputHelpers(sampleTestCases)
      );
      expect(standardAdapter.getReturnType()).toBe(factoryAdapter.getReturnType());
      expect(standardAdapter.getSerializerMethod()).toBe(factoryAdapter.getSerializerMethod());
      expect(standardAdapter.getDefaultClassName()).toBe(factoryAdapter.getDefaultClassName());
    });

    test('should throw error for invalid standard adapter key', async () => {
      await expect(
        loadAdapter('standard:notARealAdapter:java')
      ).rejects.toThrow();
    });

    test('should throw error for non-existent adapter', async () => {
      await expect(
        loadAdapter('./adapters/nonExistentAdapter.js')
      ).rejects.toThrow();
    });

    test('should throw error for invalid adapter path', async () => {
      await expect(
        loadAdapter('/invalid/path/adapter.js')
      ).rejects.toThrow();
    });
  });

  describe('clearCache', () => {
    test('should clear adapter cache', async () => {
      const adapter1 = await loadAdapter('standard:twoSum:java');
      clearCache();
      const adapter2 = await loadAdapter('standard:twoSum:java');
      // Standard adapters are created per load, so clearCache should allow a new instance.
      expect(adapter1).not.toBe(adapter2);
      // But should have same functionality.
      expect(adapter1.getReturnType()).toBe(adapter2.getReturnType());
    });

    test('should allow loading adapter after cache clear', async () => {
      await loadAdapter('standard:twoSum:java');
      clearCache();
      const adapter = await loadAdapter('standard:twoSum:java');
      expect(adapter).toBeDefined();
    });
  });
});
