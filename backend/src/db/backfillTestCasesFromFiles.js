import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';
import { initDatabase } from './database.js';
import { getAllChallenges, getChallengeTestCases, replaceChallengeTestCases } from './queries.js';
import { loadTestCasesFromFile } from './challengeContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC_DIR = resolve(__dirname, '..');

export function resolveTestFilePath(testFile) {
  if (!testFile || testFile === 'db-only') {
    return null;
  }
  if (testFile.startsWith('./')) {
    return resolve(SRC_DIR, testFile.substring(2));
  }
  return resolve(SRC_DIR, testFile);
}

export function parseArgs(argv) {
  return {
    replace: argv.includes('--replace')
  };
}

export async function backfillTestCases({ replace } = {}) {
  initDatabase();

  const challenges = getAllChallenges();
  const summary = {
    total: challenges.length,
    withTestFile: 0,
    skippedNoTestFile: 0,
    skippedMissingFile: 0,
    skippedAlreadySeeded: 0,
    seededRun: 0,
    seededSubmit: 0,
    emptyRun: 0,
    emptySubmit: 0,
    errors: 0
  };

  for (const challenge of challenges) {
    const testFile = challenge.test_file;
    if (!testFile || testFile === 'db-only') {
      summary.skippedNoTestFile += 1;
      continue;
    }

    const testFilePath = resolveTestFilePath(testFile);
    if (!testFilePath || !existsSync(testFilePath)) {
      summary.skippedMissingFile += 1;
      continue;
    }

    summary.withTestFile += 1;

    const existingRun = getChallengeTestCases(challenge.id, 'run');
    const existingSubmit = getChallengeTestCases(challenge.id, 'submit');
    const hasRun = existingRun.length > 0;
    const hasSubmit = existingSubmit.length > 0;

    if (!replace && hasRun && hasSubmit) {
      summary.skippedAlreadySeeded += 1;
      continue;
    }

    try {
      const { runTests, submitTests } = await loadTestCasesFromFile({ testFile });

      if (replace || !hasRun) {
        if (runTests.length > 0) {
          replaceChallengeTestCases(challenge.id, 'run', runTests);
          summary.seededRun += 1;
        } else {
          summary.emptyRun += 1;
        }
      }

      if (replace || !hasSubmit) {
        if (submitTests.length > 0) {
          replaceChallengeTestCases(challenge.id, 'submit', submitTests);
          summary.seededSubmit += 1;
        } else {
          summary.emptySubmit += 1;
        }
      }
    } catch (error) {
      summary.errors += 1;
      console.error(`Failed to seed ${challenge.id} from ${testFile}:`, error.message);
    }
  }

  return summary;
}

async function run() {
  process.env.NODE_ENV = 'test';
  const options = parseArgs(process.argv.slice(2));
  const summary = await backfillTestCases(options);
  console.log(
    [
      `Challenges: total=${summary.total}`,
      `withTestFile=${summary.withTestFile}`,
      `seededRun=${summary.seededRun}`,
      `seededSubmit=${summary.seededSubmit}`,
      `skippedAlreadySeeded=${summary.skippedAlreadySeeded}`,
      `skippedNoTestFile=${summary.skippedNoTestFile}`,
      `skippedMissingFile=${summary.skippedMissingFile}`,
      `emptyRun=${summary.emptyRun}`,
      `emptySubmit=${summary.emptySubmit}`,
      `errors=${summary.errors}`
    ].join(' | ')
  );
}

if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  run().catch((error) => {
    console.error('Test case backfill failed:', error);
    process.exitCode = 1;
  });
}
