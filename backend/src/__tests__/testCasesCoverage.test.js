import { describe, test, expect } from '@jest/globals';
import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEST_CASES_DIR = join(__dirname, '..', 'testCases');

describe('test case modules', () => {
  test('load all test case files for coverage', async () => {
    const entries = await readdir(TEST_CASES_DIR);
    const testCaseFiles = entries.filter((name) => name.endsWith('.js'));

    const modules = await Promise.all(
      testCaseFiles.map((file) => import(pathToFileURL(join(TEST_CASES_DIR, file)).href))
    );

    expect(modules.length).toBeGreaterThan(0);
  });
});
