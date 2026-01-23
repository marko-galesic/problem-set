import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file location
const DB_DIR = join(__dirname, '../../data');
const DB_PATH = join(DB_DIR, 'challenges.db');

let db = null;

/**
 * Initialize the database connection and create schema if needed
 */
export function initDatabase() {
  if (db) {
    return db;
  }

  // Ensure data directory exists
  mkdir(DB_DIR, { recursive: true }).catch(err => {
    console.warn('Failed to create data directory:', err.message);
  });

  // Open database connection
  db = new Database(DB_PATH);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create schema
  createSchema(db);
  migrateChallengesDifficultyColumn(db);
  ensureSubmissionsSolutionColumn(db);
  ensureSubmissionsAttemptsColumn(db);
  ensureSubmissionsTechBarColumns(db);
  ensureSubmissionsGuidanceColumn(db);
  ensureSubmissionsLanguageColumn(db);
  ensureFitnessHistoryLanguageColumn(db);

  return db;
}

/**
 * Get the database instance (initializes if needed)
 */
export function getDatabase() {
  if (!db) {
    return initDatabase();
  }
  return db;
}

/**
 * Create database schema
 */
function createSchema(database) {
  // Challenges table
  database.exec(`
    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      folder TEXT NOT NULL,
      test_file TEXT NOT NULL,
      adapter TEXT NOT NULL,
      difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard') OR difficulty IS NULL),
      topics TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Challenge prerequisites (many-to-many)
  database.exec(`
    CREATE TABLE IF NOT EXISTS challenge_prerequisites (
      challenge_id TEXT NOT NULL,
      prerequisite_id TEXT NOT NULL,
      PRIMARY KEY (challenge_id, prerequisite_id),
      FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
      FOREIGN KEY (prerequisite_id) REFERENCES challenges(id) ON DELETE CASCADE
    )
  `);

  // Challenge tree (parent-child relationships for visualization)
  database.exec(`
    CREATE TABLE IF NOT EXISTS challenge_tree (
      challenge_id TEXT PRIMARY KEY,
      parent_id TEXT,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES challenges(id) ON DELETE CASCADE
    )
  `);

  // Company tier requirements
  database.exec(`
    CREATE TABLE IF NOT EXISTS challenge_company_tiers (
      challenge_id TEXT NOT NULL,
      tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3, 4)),
      required BOOLEAN DEFAULT 1,
      PRIMARY KEY (challenge_id, tier),
      FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
    )
  `);

  // Submissions table
  database.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      challenge_id TEXT NOT NULL,
      avg_time INTEGER NOT NULL,
      timer_time INTEGER NOT NULL,
      date DATETIME NOT NULL,
      solution TEXT,
      submit_attempts INTEGER,
      tech_bar_status TEXT DEFAULT 'pending',
      tech_bar_label TEXT,
      guidance_level TEXT DEFAULT 'Independent',
      language TEXT NOT NULL DEFAULT 'java',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
    )
  `);

  // Topic fitness history snapshots
  database.exec(`
    CREATE TABLE IF NOT EXISTS fitness_history (
      snapshot_at DATETIME NOT NULL,
      topic TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
      fitness REAL NOT NULL,
      submission_count INTEGER NOT NULL,
      last_submission DATETIME,
      language TEXT NOT NULL DEFAULT 'java',
      PRIMARY KEY (snapshot_at, topic, difficulty, language)
    )
  `);

  // Create indexes for better query performance
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_submissions_challenge_date 
    ON submissions(challenge_id, date DESC);
    
    CREATE INDEX IF NOT EXISTS idx_fitness_history_snapshot
    ON fitness_history(snapshot_at DESC);

    CREATE INDEX IF NOT EXISTS idx_challenges_folder 
    ON challenges(folder);
    
    CREATE INDEX IF NOT EXISTS idx_challenge_tree_parent 
    ON challenge_tree(parent_id);
  `);
}

function migrateChallengesDifficultyColumn(database) {
  const columns = database.prepare('PRAGMA table_info(challenges)').all();
  const difficultyColumn = columns.find(column => column.name === 'difficulty');
  if (!difficultyColumn) {
    return;
  }

  if ((difficultyColumn.type || '').toUpperCase() === 'TEXT') {
    return;
  }

  database.exec('PRAGMA foreign_keys = OFF');
  const transaction = database.transaction(() => {
    database.exec(`
      CREATE TABLE challenges_new (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        folder TEXT NOT NULL,
        test_file TEXT NOT NULL,
        adapter TEXT NOT NULL,
        difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard') OR difficulty IS NULL),
        topics TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    database.exec(`
      INSERT INTO challenges_new (id, name, folder, test_file, adapter, difficulty, topics, created_at, updated_at)
      SELECT
        id,
        name,
        folder,
        test_file,
        adapter,
        CASE difficulty
          WHEN 1 THEN 'easy'
          WHEN 2 THEN 'medium'
          WHEN 3 THEN 'hard'
          ELSE NULL
        END,
        topics,
        created_at,
        updated_at
      FROM challenges
    `);

    database.exec('DROP TABLE challenges');
    database.exec('ALTER TABLE challenges_new RENAME TO challenges');
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_challenges_folder
      ON challenges(folder)
    `);
  });

  transaction();
  database.exec('PRAGMA foreign_keys = ON');
}

function ensureSubmissionsSolutionColumn(database) {
  const columns = database.prepare('PRAGMA table_info(submissions)').all();
  const hasSolution = columns.some(column => column.name === 'solution');
  if (!hasSolution) {
    database.exec('ALTER TABLE submissions ADD COLUMN solution TEXT');
  }
}

function ensureSubmissionsTechBarColumns(database) {
  const columns = database.prepare('PRAGMA table_info(submissions)').all();
  const hasStatus = columns.some(column => column.name === 'tech_bar_status');
  const hasLabel = columns.some(column => column.name === 'tech_bar_label');

  if (!hasStatus) {
    database.exec("ALTER TABLE submissions ADD COLUMN tech_bar_status TEXT DEFAULT 'pending'");
  }
  if (!hasLabel) {
    database.exec('ALTER TABLE submissions ADD COLUMN tech_bar_label TEXT');
  }
}

function ensureSubmissionsGuidanceColumn(database) {
  const columns = database.prepare('PRAGMA table_info(submissions)').all();
  const hasGuidance = columns.some(column => column.name === 'guidance_level');
  if (!hasGuidance) {
    database.exec("ALTER TABLE submissions ADD COLUMN guidance_level TEXT DEFAULT 'Independent'");
  }
}

function ensureSubmissionsAttemptsColumn(database) {
  const columns = database.prepare('PRAGMA table_info(submissions)').all();
  const hasAttempts = columns.some(column => column.name === 'submit_attempts');
  if (!hasAttempts) {
    database.exec('ALTER TABLE submissions ADD COLUMN submit_attempts INTEGER');
  }
}

function ensureSubmissionsLanguageColumn(database) {
  const columns = database.prepare('PRAGMA table_info(submissions)').all();
  const hasLanguage = columns.some(column => column.name === 'language');
  if (!hasLanguage) {
    database.exec("ALTER TABLE submissions ADD COLUMN language TEXT DEFAULT 'java'");
    database.exec("UPDATE submissions SET language = 'java' WHERE language IS NULL");
  }
}

function ensureFitnessHistoryLanguageColumn(database) {
  const columns = database.prepare('PRAGMA table_info(fitness_history)').all();
  const hasLanguage = columns.some(column => column.name === 'language');
  if (hasLanguage) {
    return;
  }

  database.exec('PRAGMA foreign_keys = OFF');
  const transaction = database.transaction(() => {
    database.exec(`
      CREATE TABLE fitness_history_new (
        snapshot_at DATETIME NOT NULL,
        topic TEXT NOT NULL,
        difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
        fitness REAL NOT NULL,
        submission_count INTEGER NOT NULL,
        last_submission DATETIME,
        language TEXT NOT NULL DEFAULT 'java',
        PRIMARY KEY (snapshot_at, topic, difficulty, language)
      )
    `);

    database.exec(`
      INSERT INTO fitness_history_new (
        snapshot_at,
        topic,
        difficulty,
        fitness,
        submission_count,
        last_submission,
        language
      )
      SELECT
        snapshot_at,
        topic,
        difficulty,
        fitness,
        submission_count,
        last_submission,
        'java'
      FROM fitness_history
    `);

    database.exec('DROP TABLE fitness_history');
    database.exec('ALTER TABLE fitness_history_new RENAME TO fitness_history');
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_fitness_history_snapshot
      ON fitness_history(snapshot_at DESC);
    `);
  });

  transaction();
  database.exec('PRAGMA foreign_keys = ON');
}


/**
 * Close database connection (useful for tests)
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
