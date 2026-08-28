import { describe, test, expect } from '@jest/globals';
import { initDatabase } from '../../db/database.js';
import {
  getChallengeAdapterDefinition,
  getChallengeAsset,
  getChallengeTestCases,
  getChallengeById,
  insertChallenge
} from '../../db/queries.js';
import { seedChallengeContent } from '../../db/seedChallengeContent.js';
import { __testables as dbOnlyTestables } from '../../db/seedDbOnlyChallenges.js';

describe('seedChallengeContent', () => {
  test('seeds a minimal challenge map', async () => {
    initDatabase();

    const summary = await seedChallengeContent({
      two_sum: {
        name: 'Two Sum',
        folder: 'two_sum',
        testFile: './testCases/twoSumTests.js',
        adapter: 'standard:twoSum:java'
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

  test('preserves configured metadata on first registration', async () => {
    initDatabase();

    await seedChallengeContent({
      youtube_ads: {
        name: 'YouTube Ads',
        folder: 'youtube_ads',
        testFile: './testCases/youtubeAdsTests.js',
        adapter: 'standard:youtubeAds:java',
        difficulty: 'hard',
        topics: ['Dynamic Programming', 'Intervals', 'Binary Search']
      }
    });

    const challenge = getChallengeById('youtube_ads');
    expect(challenge.difficulty).toBe('hard');
    expect(JSON.parse(challenge.topics)).toEqual(['Dynamic Programming', 'Intervals', 'Binary Search']);
    expect(getChallengeAsset('youtube_ads', 'interviewer_notes_html', '')?.content)
      .toContain('YouTube Ads — Interviewer Notes');
  });

  test('does not overwrite metadata for an existing challenge', async () => {
    initDatabase();
    insertChallenge({
      id: 'existing_metadata_seed',
      name: 'Existing Metadata',
      folder: 'two_sum',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: 'medium',
      topics: ['Arrays']
    });

    await seedChallengeContent({
      existing_metadata_seed: {
        name: 'Existing Metadata',
        folder: 'two_sum',
        testFile: './testCases/twoSumTests.js',
        adapter: 'standard:twoSum:java'
      }
    });

    const challenge = getChallengeById('existing_metadata_seed');
    expect(challenge.difficulty).toBe('medium');
    expect(JSON.parse(challenge.topics)).toEqual(['Arrays']);
  });
});



describe('seedDbOnlyChallenges helpers', () => {
  const {
    DB_ONLY_CHALLENGES,
    toPascalCase,
    toCamelCase,
    buildExpression,
    buildDescription,
    buildTestCases,
    buildAdapterDefinition,
    computeExpected
  } = dbOnlyTestables;

  test('case helpers convert ids into class and method names', () => {
    expect(toPascalCase('multiply_by_thirteen')).toBe('MultiplyByThirteen');
    expect(toCamelCase('square_plus_four')).toBe('squarePlusFour');
  });

  test('buildExpression handles divide per language', () => {
    expect(buildExpression('divide', 7, 'python')).toBe('int(n / 7)');
    expect(buildExpression('divide', 7, 'javascript')).toBe('Math.trunc(n / 7)');
    expect(buildExpression('divide', 7, 'typescript')).toBe('Math.trunc(n / 7)');
    expect(buildExpression('divide', 7, 'java')).toBe('n / 7');
  });

  test('computeExpected covers all operations', () => {
    expect(computeExpected('add', 5, 11)).toBe(16);
    expect(computeExpected('subtract', 5, 11)).toBe(-6);
    expect(computeExpected('multiply', -3, 4)).toBe(-12);
    expect(computeExpected('divide', -10, 3)).toBe(-3);
    expect(computeExpected('square_plus', -3, 4)).toBe(13);
    expect(computeExpected('square_minus', 5, 6)).toBe(19);
    expect(computeExpected('cube_plus', 2, 3)).toBe(11);
  });

  test('buildDescription adds requirements based on operation', () => {
    const divideDescription = buildDescription({ op: 'divide', k: 7, methodName: 'divideBySeven' });
    expect(divideDescription).toContain('integer division');
    expect(divideDescription).toContain('The input may be negative');

    const addDescription = buildDescription({ op: 'add', k: 11, methodName: 'addEleven' });
    expect(addDescription).toContain('n + 11');
    expect(addDescription).toContain('The input may be negative');

    const squareDescription = buildDescription({ op: 'square_plus', k: 4, methodName: 'squarePlusFour' });
    expect(squareDescription).toContain('n * n + 4');
    expect(squareDescription).not.toContain('The input may be negative');
  });

  test('buildTestCases returns run and submit sets with computed expectations', () => {
    const { runTests, submitTests } = buildTestCases('multiply', 13);
    expect(runTests).toHaveLength(3);
    expect(submitTests).toHaveLength(5);
    expect(runTests[1]).toMatchObject({ n: 5, expected: 65 });
  });

  test('buildAdapterDefinition wires method and class name', () => {
    const definition = buildAdapterDefinition('AddEleven', 'addEleven');
    expect(definition.method).toBe('addEleven');
    expect(definition.className).toBe('AddEleven');
    expect(definition.returnType).toBe('int');
    expect(definition.inputs[0]).toMatchObject({ name: 'n', type: 'int' });
  });

  test('db-only challenge list stays at 25 entries', () => {
    expect(DB_ONLY_CHALLENGES).toHaveLength(25);
  });
});

