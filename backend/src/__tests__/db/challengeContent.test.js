import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { initDatabase } from '../../db/database.js';
import { insertChallenge, getChallengeAsset } from '../../db/queries.js';
import { getChallengeAssetContent } from '../../db/challengeContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '../../../../data');

describe('challenge content storage', () => {
  let folder = null;
  let challengeId = null;

  beforeEach(async () => {
    initDatabase();
    folder = `content_seed_${randomUUID()}`;
    challengeId = `content_seed_${randomUUID()}`;
    await mkdir(join(DATA_DIR, folder), { recursive: true });
    insertChallenge({
      id: challengeId,
      name: 'Content Seed',
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

  test('prefers DB assets after seeding from file', async () => {
    const templatePath = join(DATA_DIR, folder, 'template.java');
    const firstContent = 'class ContentSeed { }';
    const secondContent = 'class ContentSeedUpdated { }';

    await writeFile(templatePath, firstContent, 'utf8');

    const initial = await getChallengeAssetContent({
      challengeId,
      folder,
      type: 'template',
      language: 'java'
    });
    expect(initial).toBe(firstContent);

    const stored = getChallengeAsset(challengeId, 'template', 'java');
    expect(stored?.content).toBe(firstContent);

    await writeFile(templatePath, secondContent, 'utf8');

    const second = await getChallengeAssetContent({
      challengeId,
      folder,
      type: 'template',
      language: 'java'
    });
    expect(second).toBe(firstContent);
  });
});
