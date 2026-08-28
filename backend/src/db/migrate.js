import { initDatabase, closeDatabase } from './database.js';
import { insertChallengeIfMissing, insertSubmission } from './queries.js';
import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load CHALLENGES by discovering from file system and matching with test files
 */
async function loadChallenges() {
  // Always use file-based discovery to avoid importing server.js (which starts the server)
  console.log('Discovering challenges from file system...');
  return await discoverChallengesFromFiles();
}

/**
 * Migrate existing challenges from CHALLENGES object to database
 */
async function migrateChallenges() {
  console.log('Migrating challenges from CHALLENGES object...');
  
  const CHALLENGES = await loadChallenges();
  
  let migrated = 0;
  for (const [id, config] of Object.entries(CHALLENGES)) {
    try {
      insertChallengeIfMissing({
        id,
        name: config.name,
        folder: config.folder,
        test_file: config.testFile,
        adapter: config.adapter,
        difficulty: config.difficulty ?? null,
        topics: config.topics || []
      });
      migrated++;
    } catch (error) {
      // If challenge already exists, that's fine
      if (error.message && error.message.includes('UNIQUE constraint')) {
        // Skip duplicate
      } else {
        console.error(`Failed to migrate challenge ${id}:`, error.message);
      }
    }
  }
  
  console.log(`Migrated ${migrated} challenges`);
  return migrated;
}

/**
 * Convert underscore-separated folder name to camelCase test file name
 * Example: best_time_to_buy_and_sell_stock -> bestTimeToBuyAndSellStockTests.js
 */
function toCamelCaseTestFile(folderName) {
  const parts = folderName.split('_');
  if (parts.length === 0) return `${folderName}Tests.js`;
  
  // First word lowercase, rest capitalized
  const camelCase = parts[0].toLowerCase() + 
    parts.slice(1).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('');
  
  return `./testCases/${camelCase}Tests.js`;
}

/**
 * Convert underscore-separated folder name to camelCase adapter name
 * Example: best_time_to_buy_and_sell_stock -> bestTimeToBuyAndSellStockAdapter.js
 */
function toCamelCaseAdapter(folderName) {
  const parts = folderName.split('_');
  if (parts.length === 0) return `./adapters/${folderName}Adapter.js`;
  
  // First word lowercase, rest capitalized
  const camelCase = parts[0].toLowerCase() + 
    parts.slice(1).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('');
  
  return `./adapters/${camelCase}Adapter.js`;
}

/**
 * Discover challenges from file system by scanning /data directory
 */
async function discoverChallengesFromFiles() {
  const dataDir = join(__dirname, '../../../data');
  const CHALLENGES = {};
  
  try {
    const folders = await readdir(dataDir);
    
    for (const folder of folders) {
      const folderPath = join(dataDir, folder);
      
      try {
        const stats = await stat(folderPath);
        if (!stats.isDirectory()) {
          continue;
        }
        
        // Check if it has required files
        const templatePath = join(folderPath, 'template.java');
        try {
          await stat(templatePath);
          // This looks like a challenge folder
          // We'll need to infer test file and adapter from folder name
          // For now, use defaults that match the pattern
          const challengeId = folder;
          const name = folder.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          
          // Try to find matching test file and adapter
          // Check for various naming patterns (camelCase first, then fallbacks)
          const testFilePatterns = [
            toCamelCaseTestFile(folder),  // camelCase pattern (most common)
            `./testCases/${folder}Tests.js`,  // underscore pattern
            `./testCases/${folder}.js`,  // no Tests suffix
            `./testCases/b_${folder}Tests.js`  // b_ prefix pattern
          ];
          const adapterPatterns = [
            toCamelCaseAdapter(folder),  // camelCase pattern (most common)
            `./adapters/${folder}Adapter.js`,  // underscore pattern
            `./adapters/${folder.replace(/_/g, '')}Adapter.js`  // no underscores
          ];
          
          // Find first existing test file
          let testFile = testFilePatterns[0];
          for (const pattern of testFilePatterns) {
            const testPath = join(__dirname, '../', pattern.replace('./', ''));
            try {
              await stat(testPath);
              testFile = pattern;
              break;
            } catch {
              continue;
            }
          }
          
          // Find first existing adapter
          let adapter = adapterPatterns[0];
          for (const pattern of adapterPatterns) {
            const adapterPath = join(__dirname, '../', pattern.replace('./', ''));
            try {
              await stat(adapterPath);
              adapter = pattern;
              break;
            } catch {
              continue;
            }
          }
          
          CHALLENGES[challengeId] = {
            name,
            folder,
            testFile,
            adapter
          };
        } catch {
          // No template.java, skip
          continue;
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    console.error('Error discovering challenges from files:', error.message);
  }
  
  return CHALLENGES;
}

/**
 * Migrate submissions from JSON files to database
 */
async function migrateSubmissions() {
  console.log('Migrating submissions from JSON files...');
  
  const dataDir = join(__dirname, '../../../data');
  let totalSubmissions = 0;
  let challengesProcessed = 0;
  
  try {
    const folders = await readdir(dataDir);
    
    for (const folder of folders) {
      const folderPath = join(dataDir, folder);
      
      try {
        const stats = await stat(folderPath);
        if (!stats.isDirectory()) {
          continue;
        }
      } catch {
        continue;
      }
      
      const submissionsPath = join(folderPath, 'submissions.json');
      
      try {
        const submissionsContent = await readFile(submissionsPath, 'utf8');
        const submissions = JSON.parse(submissionsContent);
        
        if (!Array.isArray(submissions)) {
          console.warn(`Invalid submissions.json format in ${folder}`);
          continue;
        }
        
        for (const submission of submissions) {
          try {
            // Validate submission data
            if (!submission.id || !submission.challenge || 
                submission.avgTime === undefined || 
                submission.timerTime === undefined || 
                !submission.date) {
              console.warn(`Skipping invalid submission in ${folder}:`, submission);
              continue;
            }
            
            insertSubmission({
              id: submission.id,
              challenge_id: submission.challenge,
              avg_time: Number(submission.avgTime),
              timer_time: Number(submission.timerTime),
              date: submission.date,
              solution: submission.solution ?? null,
              submit_attempts: submission.submitAttempts ?? null,
              language: submission.language ?? 'java'
            });
            
            totalSubmissions++;
          } catch (error) {
            // If submission already exists (duplicate), skip it
            if (error.message && error.message.includes('UNIQUE constraint')) {
              // Skip duplicate
            } else {
              console.error(`Failed to migrate submission ${submission.id}:`, error.message);
            }
          }
        }
        
        if (submissions.length > 0) {
          challengesProcessed++;
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          // File doesn't exist, skip
          continue;
        } else {
          console.error(`Error reading submissions from ${folder}:`, error.message);
        }
      }
    }
    
    console.log(`Migrated ${totalSubmissions} submissions from ${challengesProcessed} challenges`);
    return totalSubmissions;
  } catch (error) {
    console.error('Error during submissions migration:', error.message);
    throw error;
  }
}

/**
 * Run the full migration
 */
export async function runMigration() {
  console.log('Starting database migration...');
  
  try {
    // Initialize database
    initDatabase();
    
    // Migrate challenges
    const challengesMigrated = await migrateChallenges();
    
    // Migrate submissions
    const submissionsMigrated = await migrateSubmissions();
    
    console.log('\nMigration completed successfully!');
    console.log(`- Challenges migrated: ${challengesMigrated}`);
    console.log(`- Submissions migrated: ${submissionsMigrated}`);
    
    return {
      challenges: challengesMigrated,
      submissions: submissionsMigrated
    };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    closeDatabase();
  }
}

// Run migration if this file is executed directly
// This will be true when run via: node src/db/migrate.js or npm run migrate
if (process.argv[1] && process.argv[1].includes('migrate.js')) {
  runMigration()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration error:', error);
      process.exit(1);
    });
}

