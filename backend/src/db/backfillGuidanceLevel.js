import { initDatabase, closeDatabase, getDatabase } from './database.js';

function backfillGuidanceLevel() {
  initDatabase();
  const db = getDatabase();
  const updateStatement = db.prepare(`
    UPDATE submissions
    SET guidance_level = 'Not set'
  `);

  try {
    const result = updateStatement.run();
    console.log(`Updated ${result.changes} submissions to guidance_level = "Not set".`);
  } finally {
    closeDatabase();
  }
}

if (process.argv[1] && process.argv[1].includes('backfillGuidanceLevel.js')) {
  backfillGuidanceLevel();
}
