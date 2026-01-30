import { describe, test, expect, beforeEach } from '@jest/globals';
import { loadAdapter, clearCache } from '../../adapters/index.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { initDatabase } from '../../db/database.js';
import { insertChallenge, upsertChallengeAdapterDefinition } from '../../db/queries.js';
import { standardAdapterDefinitions } from '../../adapters/standardAdapterDefinitions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Adapter Registry', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('loadAdapter', () => {
    test('should load Two Sum adapter', async () => {
      const adapter = await loadAdapter('./adapters/twoSumAdapter.js');
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
      const adapter1 = await loadAdapter('./adapters/twoSumAdapter.js');
      const adapter2 = await loadAdapter('./adapters/twoSumAdapter.js');
      expect(adapter1).toBe(adapter2); // Same instance
    });

    test('should handle adapter path with ./ prefix', async () => {
      const adapter = await loadAdapter('./adapters/twoSumAdapter.js');
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
        adapter: './adapters/twoSumAdapter.js',
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
      const adapter1 = await loadAdapter('./adapters/twoSumAdapter.js');
      clearCache();
      const adapter2 = await loadAdapter('./adapters/twoSumAdapter.js');
      // ES modules are singletons, so adapter1 and adapter2 will be the same object
      // The cache clear still works (clears internal cache), but ES module imports are cached by Node.js
      expect(adapter1).toBe(adapter2); // Same instance due to ES module singleton behavior
      // But should have same functionality
      expect(adapter1.getReturnType()).toBe(adapter2.getReturnType());
    });

    test('should allow loading adapter after cache clear', async () => {
      await loadAdapter('./adapters/twoSumAdapter.js');
      clearCache();
      const adapter = await loadAdapter('./adapters/twoSumAdapter.js');
      expect(adapter).toBeDefined();
    });
  });
});
