import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

describe('frontend API boundary', () => {
  it('does not ship loopback debug telemetry from browser entry points', () => {
    for (const file of ['App.jsx', 'main.jsx', 'components/ChallengeListPage.jsx', 'components/SubmissionsPage.jsx']) {
      const source = readFileSync(resolve(root, file), 'utf8');
      expect(source).not.toContain('127.0.0.1:7245');
    }
  });

  it('routes browser API callers through the central client', () => {
    for (const file of ['App.jsx', 'components/ChallengeListPage.jsx', 'components/SubmissionsPage.jsx']) {
      const source = readFileSync(resolve(root, file), 'utf8');
      expect(source).toContain('apiFetch');
      expect(source).not.toMatch(/(?<!api)fetch\(/);
    }
  });
});
