import { initDatabase, closeDatabase } from './database.js';

const difficultyUpdates = new Map([
  ['best_time_to_buy_and_sell_stock', 'easy'],
  ['coin_change', 'medium'],
  ['invert_binary_tree', 'easy'],
  ['longestSubstringWithoutRepeatingCharacters', 'medium'],
  ['longest_substring_without_repeating_characters', 'medium'],
  ['longest_repeating_character_replacement', 'medium'],
  ['merge_two_sorted_lists', 'easy'],
  ['number_of_islands', 'medium'],
  ['reverse_linked_list', 'easy'],
  ['two_sum', 'easy'],
  ['valid_parentheses', 'easy'],
  ['validate_binary_search_tree', 'medium']
]);

const customChallenges = new Set([
  'lrucachewithttl'
]);

const db = initDatabase();
const existingIds = new Set(
  db.prepare('SELECT id FROM challenges').all().map((row) => row.id)
);

const updateStmt = db.prepare('UPDATE challenges SET difficulty = ? WHERE id = ?');
const clearStmt = db.prepare('UPDATE challenges SET difficulty = NULL WHERE id = ?');

let updated = 0;
let cleared = 0;

for (const [id, difficulty] of difficultyUpdates) {
  if (!existingIds.has(id)) {
    continue;
  }
  updateStmt.run(difficulty, id);
  updated += 1;
}

for (const id of customChallenges) {
  if (!existingIds.has(id)) {
    continue;
  }
  clearStmt.run(id);
  cleared += 1;
}

closeDatabase();

console.log(`Updated ${updated} challenges; cleared ${cleared} custom difficulties.`);
