import Database from 'better-sqlite3';
import { mkdir, stat } from 'fs/promises';
import { dirname, join } from 'path';
import { getDatabasePath } from './database.js';

function timestamp() { return new Date().toISOString().replace(/[:.]/g, '-'); }

async function run() {
  const dbPath = getDatabasePath();
  if (dbPath === ':memory:') throw new Error('Cannot verify recovery for an in-memory database');
  const verificationDir = process.env.CHALLENGES_DB_RESTORE_VERIFY_DIR || join(dirname(dbPath), 'restore-verification');
  const restorePath = join(verificationDir, `restore-${timestamp()}.db`);
  await mkdir(verificationDir, { recursive: true });
  let source; let restored;
  try {
    source = new Database(dbPath, { readonly: true, fileMustExist: true });
    const sourcePages = source.pragma('page_count', { simple: true });
    await source.backup(restorePath);
    restored = new Database(restorePath, { readonly: true, fileMustExist: true });
    const integrity = restored.pragma('integrity_check', { simple: true });
    const restoredPages = restored.pragma('page_count', { simple: true });
    if (integrity !== 'ok') throw new Error(`Restored database integrity check failed: ${integrity}`);
    if (sourcePages !== restoredPages) throw new Error(`Restored database page count mismatch: source=${sourcePages} restored=${restoredPages}`);
    const info = await stat(restorePath);
    console.log(JSON.stringify({ status: 'verified', sourcePath: dbPath, restorePath, bytes: info.size, pages: restoredPages }));
  } finally {
    restored?.close();
    source?.close();
  }
}
run().catch((error) => {
  console.error(JSON.stringify({ status: 'failed', error: error.message }));
  process.exitCode = 1;
});
