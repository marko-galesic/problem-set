import { describe, test } from '@jest/globals';
import { readdir } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = resolve(__dirname, '..', '..', '..', 'data');
const REQUIRED_TEMPLATES = ['template.java', 'template.py', 'template.js', 'template.ts'];

function formatMissing(missing) {
  return missing
    .map(({ id, missingFiles }) => `${id}: ${missingFiles.join(', ')}`)
    .join('; ');
}

describe('challenge templates', () => {
  test('all challenges have templates for all languages', async () => {
    const entries = await readdir(DATA_DIR, { withFileTypes: true });
    const challengeDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

    const missing = (await Promise.all(
      challengeDirs.map(async (challengeId) => {
        const files = await readdir(join(DATA_DIR, challengeId));
        const fileSet = new Set(files);
        const missingFiles = REQUIRED_TEMPLATES.filter((template) => !fileSet.has(template));
        return missingFiles.length ? { id: challengeId, missingFiles } : null;
      })
    ))
      .filter(Boolean)
      .sort((a, b) => a.id.localeCompare(b.id));

    if (missing.length) {
      throw new Error(`Missing templates: ${formatMissing(missing)}`);
    }
  });
});
