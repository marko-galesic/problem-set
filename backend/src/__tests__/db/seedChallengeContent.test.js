import { describe, test, expect } from '@jest/globals';
import { initDatabase } from '../../db/database.js';
import {
  getChallengeAdapterDefinition,
  getChallengeAsset,
  getChallengeTestCases
} from '../../db/queries.js';
import { seedChallengeContent } from '../../db/seedChallengeContent.js';

describe('seedChallengeContent', () => {
  test('seeds a minimal challenge map', async () => {
    initDatabase();

    const summary = await seedChallengeContent({
      two_sum: {
        name: 'Two Sum',
        folder: 'two_sum',
        testFile: './testCases/twoSumTests.js',
        adapter: './adapters/twoSumAdapter.js'
      }
    });

    expect(summary.challengeCount).toBe(1);

    const adapterDef = getChallengeAdapterDefinition('two_sum');
    expect(adapterDef).toBeTruthy();

    const runTests = getChallengeTestCases('two_sum', 'run');
    const submitTests = getChallengeTestCases('two_sum', 'submit');
    expect(runTests.length).toBeGreaterThan(0);
    expect(submitTests.length).toBeGreaterThan(0);

    const description = getChallengeAsset('two_sum', 'description_html', '');
    expect(description?.content).toBeTruthy();
  });
});

