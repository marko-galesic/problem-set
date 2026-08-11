import Database from 'better-sqlite3';
import { execFile } from 'child_process';
import { mkdtemp, rm } from 'fs/promises';
import { promisify } from 'util';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { describe, expect, test } from '@jest/globals';

const execFileAsync = promisify(execFile);
const testDir = dirname(fileURLToPath(import.meta.url));
const verifierPath = join(testDir, '../../db/verifyDatabaseRestore.js');

describe('database recovery verification', () => {
  test('backs up and independently validates a restorable SQLite database', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'problem-set-restore-'));
    const sourcePath = join(directory, 'source.db');
    const outputDir = join(directory, 'verified');
    try {
      const source = new Database(sourcePath);
      source.exec("CREATE TABLE probe (id INTEGER PRIMARY KEY, value TEXT); INSERT INTO probe(value) VALUES ('recoverable');");
      source.close();

      const { stdout } = await execFileAsync(process.execPath, [verifierPath], {
        env: { ...process.env, CHALLENGES_DB_PATH: sourcePath, CHALLENGES_DB_RESTORE_VERIFY_DIR: outputDir },
      });
      const result = JSON.parse(stdout);
      expect(result.status).toBe('verified');
      expect(result.bytes).toBeGreaterThan(0);
      const restored = new Database(result.restorePath, { readonly: true });
      expect(restored.pragma('integrity_check', { simple: true })).toBe('ok');
      expect(restored.prepare('SELECT value FROM probe').get().value).toBe('recoverable');
      restored.close();
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
