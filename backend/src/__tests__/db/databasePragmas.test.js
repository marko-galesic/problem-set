import { afterEach, describe, expect, test, jest } from '@jest/globals';
import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const originalPath = process.env.CHALLENGES_DB_PATH;
let databasePath;

afterEach(async () => {
  try {
    const database = await import('../../db/database.js');
    database.closeDatabase();
  } catch {}
  await jest.resetModules();
  if (databasePath) await rm(databasePath, { force: true });
  if (originalPath === undefined) delete process.env.CHALLENGES_DB_PATH;
  else process.env.CHALLENGES_DB_PATH = originalPath;
  databasePath = undefined;
});

describe('SQLite operational pragmas', () => {
  test('uses WAL and a bounded busy timeout for a file-backed single writer database', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'problem-set-db-'));
    databasePath = join(directory, 'challenges.db');
    process.env.CHALLENGES_DB_PATH = databasePath;
    const database = await import('../../db/database.js');
    const db = database.initDatabase();

    expect(db.pragma('foreign_keys', { simple: true })).toBe(1);
    expect(db.pragma('journal_mode', { simple: true })).toBe('wal');
    expect(db.pragma('busy_timeout', { simple: true })).toBe(5000);
    expect(db.pragma('synchronous', { simple: true })).toBe(1);
  });
});
