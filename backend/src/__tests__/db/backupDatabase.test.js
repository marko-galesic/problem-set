import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

async function loadBackupDatabase({
  dbPath = '/tmp/challenges.db',
  backupDir,
  backupReject = false,
  appendReject = false
} = {}) {
  await jest.resetModules();

  const backupMock = jest.fn();
  if (backupReject) {
    backupMock.mockRejectedValue(new Error('backup failed'));
  } else {
    backupMock.mockResolvedValue(undefined);
  }

  const closeMock = jest.fn();
  const DatabaseMock = jest.fn(() => ({
    backup: backupMock,
    close: closeMock
  }));

  const appendFileMock = jest.fn();
  if (appendReject) {
    appendFileMock.mockRejectedValue(new Error('append failed'));
  } else {
    appendFileMock.mockResolvedValue(undefined);
  }

  const mkdirMock = jest.fn().mockResolvedValue(undefined);
  const statMock = jest.fn().mockResolvedValue({ size: 123 });
  const fsMocks = {
    appendFile: appendFileMock,
    mkdir: mkdirMock,
    stat: statMock
  };

  const getDatabasePath = jest.fn(() => dbPath);

  jest.unstable_mockModule('better-sqlite3', () => ({ default: DatabaseMock }));
  jest.unstable_mockModule('fs/promises', () => fsMocks);
  jest.unstable_mockModule('../../db/database.js', () => ({ getDatabasePath }));

  if (backupDir !== undefined) {
    process.env.CHALLENGES_DB_BACKUP_DIR = backupDir;
  } else {
    delete process.env.CHALLENGES_DB_BACKUP_DIR;
  }

  await import('../../db/backupDatabase.js');
  await new Promise((resolve) => setImmediate(resolve));

  return {
    DatabaseMock,
    backupMock,
    closeMock,
    fsMocks,
    getDatabasePath
  };
}

describe('backupDatabase', () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    process.exitCode = undefined;
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    delete process.env.CHALLENGES_DB_BACKUP_DIR;
    process.exitCode = undefined;
  });

  test('sets exitCode when backing up an in-memory database', async () => {
    const { DatabaseMock, fsMocks } = await loadBackupDatabase({ dbPath: ':memory:' });

    expect(process.exitCode).toBe(1);
    expect(DatabaseMock).not.toHaveBeenCalled();
    expect(fsMocks.mkdir).not.toHaveBeenCalled();
  });

  test('backs up to the configured directory and closes the handle', async () => {
    const { DatabaseMock, backupMock, closeMock, fsMocks } = await loadBackupDatabase({
      dbPath: '/tmp/challenges.db',
      backupDir: '/tmp/backup-dir'
    });

    expect(process.exitCode).toBe(0);
    expect(DatabaseMock).toHaveBeenCalledWith('/tmp/challenges.db', { readonly: true, fileMustExist: true });
    expect(backupMock).toHaveBeenCalled();
    expect(fsMocks.stat).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });

  test('records failures when backups fail', async () => {
    const { closeMock } = await loadBackupDatabase({
      dbPath: '/tmp/challenges.db',
      backupDir: '/tmp/backup-dir',
      backupReject: true
    });

    expect(process.exitCode).toBe(1);
    expect(closeMock).toHaveBeenCalled();
  });
});
