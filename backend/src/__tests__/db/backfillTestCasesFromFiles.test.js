import { describe, test, expect, afterEach, jest } from '@jest/globals';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEST_CASES_DIR = join(__dirname, '..', '..', 'testCases');

async function setupDb() {
  const tempDir = await mkdtemp(join(tmpdir(), 'backfill-testcases-'));
  process.env.CHALLENGES_DB_PATH = join(tempDir, 'challenges.db');
  process.env.NODE_ENV = 'test';
  jest.resetModules();

  const database = await import('../../db/database.js');
  database.initDatabase();

  const queries = await import('../../db/queries.js');
  const backfill = await import('../../db/backfillTestCasesFromFiles.js');

  return { tempDir, ...queries, ...backfill };
}

describe('backfillTestCasesFromFiles', () => {
  let tempDir;
  let createdFiles = [];

  afterEach(async () => {
    for (const filePath of createdFiles) {
      await rm(filePath, { force: true });
    }
    createdFiles = [];
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
    delete process.env.CHALLENGES_DB_PATH;
  });

  test('seeds missing test cases and reports skips', async () => {
    const context = await setupDb();
    tempDir = context.tempDir;
    const { insertChallenge, getChallengeTestCases, backfillTestCases } = context;

    const seededFile = `backfill_${randomUUID()}.js`;
    const seededPath = join(TEST_CASES_DIR, seededFile);
    createdFiles.push(seededPath);
    await writeFile(
      seededPath,
      [
        "export const runTests = [{ id: 1, name: 'Run', input: 'n = 1', n: 1, expected: 2 }];",
        "export const submitTests = [",
        "  { id: 1, name: 'Submit 1', input: 'n = 1', n: 1, expected: 2 },",
        "  { id: 2, name: 'Submit 2', input: 'n = 2', n: 2, expected: 3 }",
        "];",
        ""
      ].join('\n'),
      'utf8'
    );

    const emptyFile = `backfill_empty_${randomUUID()}.js`;
    const emptyPath = join(TEST_CASES_DIR, emptyFile);
    createdFiles.push(emptyPath);
    await writeFile(
      emptyPath,
      "export const runTests = [];\nexport const submitTests = [];\n",
      'utf8'
    );

    const seededId = `seed_${randomUUID()}`;
    insertChallenge({
      id: seededId,
      name: 'Seeded',
      folder: 'seeded',
      test_file: `./testCases/${seededFile}`,
      adapter: 'standard:twoSum:java',
      difficulty: null,
      topics: []
    });

    const noDotId = `seed_nodot_${randomUUID()}`;
    insertChallenge({
      id: noDotId,
      name: 'Seeded Nodot',
      folder: 'seeded_nodot',
      test_file: `testCases/${seededFile}`,
      adapter: 'standard:twoSum:java',
      difficulty: null,
      topics: []
    });

    const emptyId = `seed_empty_${randomUUID()}`;
    insertChallenge({
      id: emptyId,
      name: 'Empty',
      folder: 'empty',
      test_file: `./testCases/${emptyFile}`,
      adapter: 'standard:twoSum:java',
      difficulty: null,
      topics: []
    });

    const missingId = `seed_missing_${randomUUID()}`;
    insertChallenge({
      id: missingId,
      name: 'Missing',
      folder: 'missing',
      test_file: `./testCases/missing_${randomUUID()}.js`,
      adapter: 'standard:twoSum:java',
      difficulty: null,
      topics: []
    });

    const dbOnlyId = `seed_db_only_${randomUUID()}`;
    insertChallenge({
      id: dbOnlyId,
      name: 'DbOnly',
      folder: 'db_only',
      test_file: 'db-only',
      adapter: 'db-only',
      difficulty: null,
      topics: []
    });

    const summary = await backfillTestCases();

    expect(summary.total).toBe(5);
    expect(summary.withTestFile).toBe(3);
    expect(summary.seededRun).toBe(2);
    expect(summary.seededSubmit).toBe(2);
    expect(summary.emptyRun).toBe(1);
    expect(summary.emptySubmit).toBe(1);
    expect(summary.skippedMissingFile).toBe(1);
    expect(summary.skippedNoTestFile).toBe(1);
    expect(summary.skippedAlreadySeeded).toBe(0);

    expect(getChallengeTestCases(seededId, 'run').length).toBe(1);
    expect(getChallengeTestCases(seededId, 'submit').length).toBe(2);
  });

  test('skips already seeded unless replace is true', async () => {
    const context = await setupDb();
    tempDir = context.tempDir;
    const { insertChallenge, backfillTestCases } = context;

    const seededFile = `backfill_repeat_${randomUUID()}.js`;
    const seededPath = join(TEST_CASES_DIR, seededFile);
    createdFiles.push(seededPath);
    await writeFile(
      seededPath,
      "export const runTests = [{ id: 1, name: 'Run', input: 'n = 3', n: 3, expected: 4 }];\n" +
        "export const submitTests = [{ id: 1, name: 'Submit', input: 'n = 3', n: 3, expected: 4 }];\n",
      'utf8'
    );

    insertChallenge({
      id: `seed_repeat_${randomUUID()}`,
      name: 'Seeded Repeat',
      folder: 'seeded_repeat',
      test_file: `./testCases/${seededFile}`,
      adapter: 'standard:twoSum:java',
      difficulty: null,
      topics: []
    });

    const first = await backfillTestCases();
    expect(first.seededRun).toBe(1);
    expect(first.seededSubmit).toBe(1);
    expect(first.skippedAlreadySeeded).toBe(0);

    const second = await backfillTestCases();
    expect(second.seededRun).toBe(0);
    expect(second.seededSubmit).toBe(0);
    expect(second.skippedAlreadySeeded).toBe(1);

    const third = await backfillTestCases({ replace: true });
    expect(third.seededRun).toBe(1);
    expect(third.seededSubmit).toBe(1);
    expect(third.skippedAlreadySeeded).toBe(0);
  });

  test('parses args and resolves test file paths', async () => {
    const context = await setupDb();
    tempDir = context.tempDir;
    const { parseArgs, resolveTestFilePath } = context;

    expect(parseArgs(['--replace'])).toEqual({ replace: true });
    expect(parseArgs([])).toEqual({ replace: false });
    expect(resolveTestFilePath('db-only')).toBeNull();
    expect(resolveTestFilePath(null)).toBeNull();
    expect(resolveTestFilePath('./testCases/example.js')).toContain('testCases/example.js');
    expect(resolveTestFilePath('testCases/example.js')).toContain('testCases/example.js');
  });
});
