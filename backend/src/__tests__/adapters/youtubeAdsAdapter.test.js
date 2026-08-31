import { describe, expect, test } from '@jest/globals';
import { loadAdapter } from '../../adapters/index.js';
import { runTests, submitTests } from '../../testCases/youtubeAdsTests.js';

describe('YouTube Ads standard adapter', () => {
  for (const language of ['java', 'python', 'javascript', 'typescript', 'cpp']) {
    test(`supports ${language}`, async () => {
      const adapter = await loadAdapter(`standard:youtubeAds:${language}`);
      expect(adapter.extractInput(runTests[0])).toEqual({ ads: runTests[0].ads });
      expect(adapter.getDefaultClassName()).toBe('YouTubeAds');
      expect(adapter.getReturnType()).toMatch(/int|number/);
      expect(adapter.generateInputHelpers([...runTests, ...submitTests])).toMatch(/ads/i);
    });
  }
});
