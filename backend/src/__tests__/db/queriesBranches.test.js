import { describe, test, expect, afterEach, jest } from '@jest/globals';
import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

async function setupDb() {
  const tempDir = await mkdtemp(join(tmpdir(), 'queries-branches-'));
  process.env.CHALLENGES_DB_PATH = join(tempDir, 'challenges.db');
  process.env.NODE_ENV = 'test';
  jest.resetModules();

  const database = await import('../../db/database.js');
  database.initDatabase();

  const queries = await import('../../db/queries.js');

  return { tempDir, database, ...queries };
}

describe('queries branch coverage', () => {
  let tempDir;

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
    delete process.env.CHALLENGES_DB_PATH;
  });

  test('covers challenge insert and adapter definition branches', async () => {
    const context = await setupDb();
    tempDir = context.tempDir;
    const {
      insertChallenge,
      getChallengeById,
      getChallengeAdapterDefinition,
      upsertChallengeAdapterDefinition
    } = context;

    const arrayId = `q_${randomUUID()}`;
    insertChallenge({
      id: arrayId,
      name: 'Array Topics',
      folder: 'array_topics',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: null,
      topics: ['Arrays']
    });
    expect(getChallengeById(arrayId).topics).toContain('Arrays');

    const stringId = `q_${randomUUID()}`;
    insertChallenge({
      id: stringId,
      name: 'String Topics',
      folder: 'string_topics',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: null,
      topics: '["Graphs"]'
    });
    expect(getChallengeById(stringId).topics).toContain('Graphs');

    expect(getChallengeAdapterDefinition(`missing_${randomUUID()}`)).toBeNull();

    const defId = `q_${randomUUID()}`;
    insertChallenge({
      id: defId,
      name: 'Adapter Def',
      folder: 'adapter_def',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: null,
      topics: []
    });
    upsertChallengeAdapterDefinition(defId, {
      method: 'twoSum',
      className: 'TwoSum',
      returnType: 'int[]',
      inputs: []
    });
    expect(getChallengeAdapterDefinition(defId).method).toBe('twoSum');
  });

  test('covers test case parsing and metadata update branches', async () => {
    const context = await setupDb();
    tempDir = context.tempDir;
    const {
      insertChallenge,
      getChallengeTestCases,
      replaceChallengeTestCases,
      updateChallengeMetadata
    } = context;
    const { getDatabase } = context.database;

    const challengeId = `q_${randomUUID()}`;
    insertChallenge({
      id: challengeId,
      name: 'Parsing',
      folder: 'parsing',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: null,
      topics: []
    });

    const db = getDatabase();
    db.prepare(
      `INSERT INTO challenge_adapter_definitions (challenge_id, definition_json, updated_at)\n       VALUES (?, ?, CURRENT_TIMESTAMP)`
    ).run(challengeId, '{bad json');

    const invalidTestCaseId = `q_${randomUUID()}`;
    insertChallenge({
      id: invalidTestCaseId,
      name: 'Invalid Test Cases',
      folder: 'invalid_cases',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: null,
      topics: []
    });
    db.prepare(
      `INSERT INTO challenge_test_cases (challenge_id, kind, order_index, case_id, name, input, test_case_json, created_at)\n       VALUES (?, 'run', 0, NULL, NULL, NULL, 'not-json', CURRENT_TIMESTAMP)`
    ).run(invalidTestCaseId);

    expect(getChallengeTestCases(invalidTestCaseId, 'run')).toEqual([]);

    replaceChallengeTestCases(challengeId, 'run', [
      { id: 1, expected: 1 },
      { id: 2, input: { n: 2 }, expected: 2 },
      { id: 3, input: 3, expected: 3 }
    ]);

    expect(updateChallengeMetadata(challengeId, {})).toEqual({ changes: 0 });
    const updated = updateChallengeMetadata(challengeId, {
      name: 'Updated',
      difficulty: 'easy',
      topics: ['Arrays']
    });
    expect(updated.changes).toBeGreaterThan(0);
  });
});
