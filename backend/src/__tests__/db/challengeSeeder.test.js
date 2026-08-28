import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { initDatabase } from '../../db/database.js';
import {
  insertChallenge,
  getChallengeAdapterDefinition,
  getChallengeAsset,
  getChallengeTestCases
} from '../../db/queries.js';
import {
  seedStandardAdapterDefinition,
  seedChallengeAssetsFromFiles,
  seedChallengeTestCasesFromFiles
} from '../../db/challengeSeeder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '../../../../data');

describe('challenge seeder', () => {
  let challengeId;
  let folder;

  beforeEach(async () => {
    initDatabase();
    challengeId = `seed_${randomUUID()}`;
    folder = `seed_folder_${randomUUID()}`;

    await mkdir(join(DATA_DIR, folder), { recursive: true });
    await writeFile(join(DATA_DIR, folder, 'description.html'), '<p>Seeded</p>', 'utf8');
    await writeFile(join(DATA_DIR, folder, 'interviewer-notes.html'), '<p>Private rubric</p>', 'utf8');
    await writeFile(join(DATA_DIR, folder, 'template.java'), 'class Seeded { }', 'utf8');

    insertChallenge({
      id: challengeId,
      name: 'Seeder Test',
      folder,
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: null,
      topics: []
    });
  });

  afterEach(async () => {
    if (folder) {
      await rm(join(DATA_DIR, folder), { recursive: true, force: true });
    }
  });

  test('seedStandardAdapterDefinition stores standard definitions', async () => {
    const result = await seedStandardAdapterDefinition({
      challengeId,
      adapterPath: 'standard:twoSum:java'
    });
    expect(result.seeded).toBe(true);
    const definition = getChallengeAdapterDefinition(challengeId);
    expect(definition).toBeTruthy();
    expect(definition.method).toBe('twoSum');
  });

  test('seedStandardAdapterDefinition accepts standard file paths', async () => {
    const fileChallengeId = `seed_path_${randomUUID()}`;
    insertChallenge({
      id: fileChallengeId,
      name: 'Seeder Path Test',
      folder,
      test_file: './testCases/twoSumTests.js',
      adapter: './adapters/twoSumAdapter.js',
      difficulty: null,
      topics: []
    });

    const result = await seedStandardAdapterDefinition({
      challengeId: fileChallengeId,
      adapterPath: './adapters/twoSumAdapter.js'
    });
    expect(result.seeded).toBe(true);
    const definition = getChallengeAdapterDefinition(fileChallengeId);
    expect(definition?.method).toBe('twoSum');
  });

  test('seedChallengeAssetsFromFiles stores file assets', async () => {
    const result = await seedChallengeAssetsFromFiles({ challengeId, folder });
    expect(result.seeded).toBeGreaterThan(0);
    const asset = getChallengeAsset(challengeId, 'description_html', '');
    expect(asset?.content).toContain('Seeded');
    const notes = getChallengeAsset(challengeId, 'interviewer_notes_html', '');
    expect(notes?.content).toContain('Private rubric');
  });

  test('seedChallengeTestCasesFromFiles stores test cases', async () => {
    const result = await seedChallengeTestCasesFromFiles({
      challengeId,
      challenge: {
        testFile: './testCases/twoSumTests.js'
      }
    });
    expect(result.seeded).toBe(true);
    const runTests = getChallengeTestCases(challengeId, 'run');
    const submitTests = getChallengeTestCases(challengeId, 'submit');
    expect(runTests.length).toBeGreaterThan(0);
    expect(submitTests.length).toBeGreaterThan(0);
  });
});

