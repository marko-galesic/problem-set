import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { initDatabase } from './database.js';
import { insertChallengeIfMissing } from './queries.js';
import { seedChallengeContentFromFiles } from './challengeSeeder.js';

const __filename = fileURLToPath(import.meta.url);

export async function seedChallengeContent(challenges) {
  initDatabase();

  let challengeCount = 0;
  let assetSeeds = 0;
  let testSeeds = 0;
  let adapterSeeds = 0;

  for (const [challengeId, challenge] of Object.entries(challenges)) {
    insertChallengeIfMissing({
      id: challengeId,
      name: challenge.name,
      folder: challenge.folder,
      test_file: challenge.testFile,
      adapter: challenge.adapter,
      difficulty: challenge.difficulty ?? null,
      topics: challenge.topics || []
    });

    const result = await seedChallengeContentFromFiles({
      challengeId,
      challenge
    });

    challengeCount += 1;
    if (result.assets?.seeded) {
      assetSeeds += result.assets.seeded;
    }
    if (result.tests?.seeded) {
      testSeeds += 1;
    }
    if (result.adapter?.seeded) {
      adapterSeeds += 1;
    }
  }

  return {
    challengeCount,
    assetSeeds,
    testSeeds,
    adapterSeeds
  };
}

async function run() {
  process.env.NODE_ENV = 'test';
  const { CHALLENGES } = await import('../server.js');
  const summary = await seedChallengeContent(CHALLENGES);
  console.log(
    `Seeded ${summary.challengeCount} challenges; assets=${summary.assetSeeds}, testSets=${summary.testSeeds}, adapterDefs=${summary.adapterSeeds}`
  );
}

if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  run().catch((error) => {
    console.error('Challenge content seed failed:', error);
    process.exitCode = 1;
  });
}

