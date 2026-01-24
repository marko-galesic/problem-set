process.env.NODE_ENV = 'test';

let shouldSeed = false;
if (!process.env.CHALLENGES_DB_PATH || process.env.CHALLENGES_DB_PATH === ':memory:') {
  const { tmpdir } = await import('os');
  const { join } = await import('path');
  const workerId = process.env.JEST_WORKER_ID || '0';
  process.env.CHALLENGES_DB_PATH = join(
    tmpdir(),
    `ssml-parser-test-${process.pid}-${workerId}.db`
  );
  shouldSeed = true;
}

if (shouldSeed && !globalThis.__CHALLENGES_DB_SEEDED__) {
  const { initDatabase } = await import('../db/database.js');
  const { insertChallenge } = await import('../db/queries.js');

  initDatabase();
  insertChallenge({
    id: 'two_sum',
    name: 'Two Sum',
    folder: 'two_sum',
    test_file: './testCases/twoSumTests.js',
    adapter: './adapters/twoSumAdapter.js',
    difficulty: null,
    topics: []
  });

  globalThis.__CHALLENGES_DB_SEEDED__ = true;
}

if (shouldSeed && !globalThis.__CHALLENGES_DB_TEARDOWN__) {
  const { unlinkSync } = await import('fs');
  const dbPath = process.env.CHALLENGES_DB_PATH;
  process.once('exit', () => {
    if (!dbPath || dbPath === ':memory:') {
      return;
    }
    try {
      unlinkSync(dbPath);
    } catch {
      // Best-effort cleanup for temp DB file.
    }
  });
  globalThis.__CHALLENGES_DB_TEARDOWN__ = true;
}
