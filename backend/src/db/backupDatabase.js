import Database from 'better-sqlite3';
import { appendFile, mkdir, stat } from 'fs/promises';
import { dirname, join } from 'path';
import { getDatabasePath } from './database.js';

function formatTimestamp(date) {
  return date.toISOString().replace(/:/g, '-');
}

async function logAttempt(logPath, line) {
  try {
    await appendFile(logPath, `${line}\n`, 'utf8');
  } catch (error) {
    console.error(`[${new Date().toISOString()}] LOG_ERROR ${error.message}`);
  }
}

async function run() {
  const dbPath = getDatabasePath();
  const now = new Date();

  if (dbPath === ':memory:') {
    const line = `[${now.toISOString()}] ERROR db=:memory: message=Cannot back up in-memory database`;
    console.error(line);
    process.exitCode = 1;
    return;
  }

  const backupDir = process.env.CHALLENGES_DB_BACKUP_DIR || join(dirname(dbPath), 'backups');
  const backupName = `challenges-${formatTimestamp(now)}.db`;
  const backupPath = join(backupDir, backupName);
  const logPath = join(backupDir, 'backup.log');

  await mkdir(backupDir, { recursive: true });

  const startLine = `[${now.toISOString()}] START db=${dbPath} dest=${backupPath}`;
  console.log(startLine);
  await logAttempt(logPath, startLine);

  let db;
  try {
    db = new Database(dbPath, { readonly: true, fileMustExist: true });
    await db.backup(backupPath);

    const info = await stat(backupPath);
    const successLine = `[${new Date().toISOString()}] SUCCESS dest=${backupPath} bytes=${info.size}`;
    console.log(successLine);
    await logAttempt(logPath, successLine);
    process.exitCode = 0;
  } catch (error) {
    const errorLine = `[${new Date().toISOString()}] ERROR db=${dbPath} dest=${backupPath} message=${error.message}`;
    console.error(errorLine);
    await logAttempt(logPath, errorLine);
    process.exitCode = 1;
  } finally {
    if (db) {
      db.close();
    }
  }
}

run().catch(error => {
  console.error(`[${new Date().toISOString()}] FATAL ${error.message}`);
  process.exitCode = 1;
});
