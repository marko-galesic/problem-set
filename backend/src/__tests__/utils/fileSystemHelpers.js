/**
 * File system helpers for testing
 */

import { mkdir, writeFile, readFile, unlink, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Creates a temporary test directory
 */
export async function createTestTempDir(challengeId = 'test') {
  const testTempDir = join(__dirname, '../../../temp', `test_${challengeId}_${Date.now()}`);
  await mkdir(testTempDir, { recursive: true });
  return testTempDir;
}

/**
 * Cleans up a test directory
 */
export async function cleanupTestDir(dirPath) {
  try {
    const files = await readdir(dirPath);
    for (const file of files) {
      const filePath = join(dirPath, file);
      const stats = await stat(filePath);
      if (stats.isFile()) {
        await unlink(filePath);
      }
    }
  } catch (error) {
    // Ignore errors during cleanup
  }
}

/**
 * Writes a test file to the temp directory
 */
export async function writeTestFile(dirPath, filename, content) {
  const filePath = join(dirPath, filename);
  await writeFile(filePath, content, 'utf8');
  return filePath;
}

/**
 * Reads a test file from the temp directory
 */
export async function readTestFile(dirPath, filename) {
  const filePath = join(dirPath, filename);
  return await readFile(filePath, 'utf8');
}

/**
 * Checks if a file exists in the temp directory
 */
export async function fileExists(dirPath, filename) {
  try {
    const filePath = join(dirPath, filename);
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Lists all files in a directory
 */
export async function listFiles(dirPath) {
  try {
    return await readdir(dirPath);
  } catch {
    return [];
  }
}
