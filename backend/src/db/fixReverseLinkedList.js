import { initDatabase, getDatabase, closeDatabase } from './database.js';

/**
 * Fix the test_file path for reverse_linked_list challenge
 * Updates from incorrect underscore format to correct camelCase format
 */
async function fixReverseLinkedList() {
  try {
    // Initialize database connection
    initDatabase();
    const db = getDatabase();
    
    const challengeId = 'reverse_linked_list';
    const correctTestFile = './testCases/reverseLinkedListTests.js';
    
    // Check current value
    const stmt = db.prepare('SELECT test_file FROM challenges WHERE id = ?');
    const current = stmt.get(challengeId);
    
    if (!current) {
      console.error(`Challenge ${challengeId} not found in database`);
      process.exit(1);
    }
    
    console.log(`Current test_file: ${current.test_file}`);
    console.log(`Updating to: ${correctTestFile}`);
    
    // Update the test_file
    const updateStmt = db.prepare(`
      UPDATE challenges 
      SET test_file = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    const result = updateStmt.run(correctTestFile, challengeId);
    
    if (result.changes === 0) {
      console.error('Update failed: No rows affected');
      process.exit(1);
    }
    
    // Verify the update
    const updated = stmt.get(challengeId);
    console.log(`Updated test_file: ${updated.test_file}`);
    
    if (updated.test_file === correctTestFile) {
      console.log('✓ Successfully updated test_file path');
    } else {
      console.error('✗ Update verification failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error fixing database entry:', error);
    process.exit(1);
  } finally {
    closeDatabase();
  }
}

// Run the fix if this file is executed directly
if (process.argv[1] && process.argv[1].includes('fixReverseLinkedList.js')) {
  fixReverseLinkedList()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Fix error:', error);
      process.exit(1);
    });
}

export { fixReverseLinkedList };
