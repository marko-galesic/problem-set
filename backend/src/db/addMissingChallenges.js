import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { initDatabase } from './database.js';
import { getAllChallenges, insertChallengeIfMissing } from './queries.js';
import { seedChallengeContentFromFiles } from './challengeSeeder.js';

const __filename = fileURLToPath(import.meta.url);
const DEFAULT_COUNT = 25;

function parseArgs(argv) {
  const options = {
    count: DEFAULT_COUNT,
    dryRun: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--count' && argv[i + 1]) {
      options.count = Math.max(1, Number(argv[i + 1]));
      i += 1;
      continue;
    }
  }

  return options;
}

async function run() {
  const { count, dryRun } = parseArgs(process.argv.slice(2));
  process.env.NODE_ENV = 'test';
  initDatabase();

  const { CHALLENGES } = await import('../server.js');
  const existing = new Set(getAllChallenges().map(challenge => challenge.id));
  const missing = Object.keys(CHALLENGES)
    .filter(id => !existing.has(id))
    .sort();

  const selected = missing.slice(0, count);
  const insertedIds = [];

  let assetSeeds = 0;
  let testSeeds = 0;
  let adapterSeeds = 0;

  for (const challengeId of selected) {
    const challenge = CHALLENGES[challengeId];
    if (!challenge) {
      continue;
    }

    if (dryRun) {
      insertedIds.push(challengeId);
      continue;
    }

    const result = insertChallengeIfMissing({
      id: challengeId,
      name: challenge.name,
      folder: challenge.folder,
      test_file: challenge.testFile,
      adapter: challenge.adapter,
      difficulty: null,
      topics: []
    });

    if (!result?.changes) {
      continue;
    }

    insertedIds.push(challengeId);

    const seedResult = await seedChallengeContentFromFiles({
      challengeId,
      challenge
    });

    if (seedResult.assets?.seeded) {
      assetSeeds += seedResult.assets.seeded;
    }
    if (seedResult.tests?.seeded) {
      testSeeds += 1;
    }
    if (seedResult.adapter?.seeded) {
      adapterSeeds += 1;
    }
  }

  const summary = {
    requested: count,
    missing: missing.length,
    inserted: insertedIds.length,
    assets: assetSeeds,
    testSets: testSeeds,
    adapterDefs: adapterSeeds,
    insertedIds
  };

  console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  run().catch((error) => {
    console.error('Add missing challenges failed:', error);
    process.exitCode = 1;
  });
}
