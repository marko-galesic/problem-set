import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDatabase, closeDatabase } from './database.js';
import { getAllChallenges, updateChallengeMetadata } from './queries.js';

const GRAPHQL_URL = 'https://leetcode.com/graphql/';
const QUESTION_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      difficulty
      topicTags { name }
    }
  }
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DEFAULT_CACHE_PATH = join(__dirname, '../../data/leetcode-problem-cache.json');

const SLUG_OVERRIDES = {
  count_bits: 'counting-bits',
  two_sum_ii_input_sorted: 'two-sum-ii-input-array-is-sorted',
  valid_parentheses_with_star: 'valid-parenthesis-string',
  detect_cycle_in_linked_list: 'linked-list-cycle-ii',
  lowest_common_ancestor_binary_tree: 'lowest-common-ancestor-of-a-binary-tree',
  lowest_common_ancestor_bst: 'lowest-common-ancestor-of-a-binary-search-tree',
  kth_smallest_in_bst: 'kth-smallest-element-in-a-bst',
  search_2d_matrix: 'search-a-2d-matrix',
  max_depth_of_binary_tree: 'maximum-depth-of-binary-tree',
  level_order_traversal: 'binary-tree-level-order-traversal',
  unique_paths_with_obstacles: 'unique-paths-ii',
  reverse_words_in_string: 'reverse-words-in-a-string',
  middle_of_linked_list: 'middle-of-the-linked-list',
  min_steps_to_zero: 'number-of-steps-to-reduce-a-number-to-zero',
  digital_root: 'add-digits',
  sum_of_digit_squares: 'happy-number',
  rotate_string_k: 'rotate-string'
};

const HARD_OVERRIDES = new Set([
  'edit_distance',
  'minimum_window_substring',
  'merge_k_sorted_lists',
  'sliding_window_maximum',
  'sudoku_solver',
  'trapping_rain_water',
  'valid_parentheses_with_star'
]);

const MEDIUM_OVERRIDES = new Set([
  'combination_sum',
  'combination_sum_ii',
  'container_with_most_water',
  'detect_cycle_in_linked_list',
  'edit_distance',
  'find_minimum_in_rotated_sorted_array',
  'find_peak_element',
  'four_sum',
  'generate_parentheses',
  'group_anagrams',
  'house_robber',
  'insert_interval',
  'jump_game',
  'kth_largest_element_in_an_array',
  'kth_smallest_in_bst',
  'letter_combinations_of_a_phone_number',
  'level_order_traversal',
  'longest_common_subsequence',
  'longest_palindromic_substring',
  'longest_repeating_character_replacement',
  'longest_substring_without_repeating_characters',
  'lowest_common_ancestor_binary_tree',
  'meeting_rooms',
  'meeting_rooms_ii',
  'merge_intervals',
  'minimum_window_substring',
  'non_overlapping_intervals',
  'number_of_islands',
  'partition_equal_subset_sum',
  'permutation_in_string',
  'permutations',
  'rotting_oranges',
  'search_2d_matrix',
  'search_in_rotated_sorted_array',
  'set_matrix_zeroes',
  'spiral_matrix',
  'subsets',
  'subsets_ii',
  'three_sum',
  'top_k_frequent_elements',
  'top_k_frequent_words',
  'two_sum_ii_input_sorted',
  'unique_paths_with_obstacles',
  'validate_binary_search_tree',
  'valid_sudoku',
  'word_search'
]);

function parseArgs(argv) {
  const options = {
    dryRun: false,
    force: false,
    noLeetCode: false,
    cacheFile: DEFAULT_CACHE_PATH,
    noCache: false,
    limit: null
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--force') {
      options.force = true;
      continue;
    }
    if (arg === '--no-leetcode') {
      options.noLeetCode = true;
      continue;
    }
    if (arg === '--no-cache') {
      options.noCache = true;
      continue;
    }
    if (arg === '--cache-file' && argv[i + 1]) {
      options.cacheFile = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--limit' && argv[i + 1]) {
      options.limit = Math.max(1, Number(argv[i + 1]));
      i += 1;
      continue;
    }
  }

  return options;
}

function parseTopics(rawTopics) {
  if (Array.isArray(rawTopics)) {
    return rawTopics;
  }
  if (typeof rawTopics === 'string' && rawTopics.trim()) {
    try {
      const parsed = JSON.parse(rawTopics);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeTopics(topics) {
  const normalized = new Set();
  for (const topic of topics || []) {
    if (typeof topic !== 'string') {
      continue;
    }
    const trimmed = topic.trim();
    if (trimmed) {
      normalized.add(trimmed);
    }
  }
  return Array.from(normalized);
}

function normalizeDifficulty(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized;
  }
  if (normalized === 'easy'.toLowerCase()) {
    return 'easy';
  }
  if (normalized === 'medium'.toLowerCase()) {
    return 'medium';
  }
  if (normalized === 'hard'.toLowerCase()) {
    return 'hard';
  }
  return null;
}

function slugForChallengeId(challengeId) {
  return SLUG_OVERRIDES[challengeId] || challengeId.replace(/_/g, '-');
}

function isStringTask(text) {
  return /string|substring|palindrome|anagram|vowel|consonant|uppercase|lowercase|digit|letter|word|char|trim|whitespace|replace|toggle|case/.test(text);
}

function isArrayTask(text) {
  return /array|arrays|matrix|grid|row|column|subarray|interval|intervals|prefix|suffix|sum|product|rotate|transpose/.test(text);
}

function isMathTask(text) {
  return /add|subtract|multiply|divide|square|cube|sum|product|number|digit|digits|even|odd|negative|positive|power|factorial|fibonacci|prime|modulo/.test(text);
}

function inferTopics(challengeId) {
  const text = challengeId.toLowerCase();
  const topics = new Set();

  if (text.includes('binary_tree') || text.includes('binary-tree') || text.includes('bst')) {
    topics.add('Binary Tree');
  } else if (text.includes('tree')) {
    topics.add('Tree');
  }
  if (text.includes('bst') || text.includes('binary_search_tree')) {
    topics.add('Binary Search Tree');
  }
  if (text.includes('linked_list') || text.includes('linked-list') || text.includes('list_node') || text.includes('linked')) {
    topics.add('Linked List');
  }
  if (text.includes('stack')) {
    topics.add('Stack');
  }
  if (text.includes('queue')) {
    topics.add('Queue');
  }
  if (text.includes('heap') || text.includes('priority')) {
    topics.add('Heap (Priority Queue)');
  }
  if (text.includes('graph') || text.includes('island') || text.includes('islands') || text.includes('flood_fill') || text.includes('rotting_oranges')) {
    topics.add('Graph');
  }
  if (text.includes('matrix') || text.includes('grid') || text.includes('sudoku')) {
    topics.add('Matrix');
  }
  if (text.includes('array') || text.includes('arrays') || text.includes('subarray') || text.includes('interval') || text.includes('intervals')) {
    topics.add('Array');
  }
  if (isStringTask(text)) {
    topics.add('String');
  }
  if (isArrayTask(text)) {
    topics.add('Array');
  }
  if (text.includes('interval') || text.includes('meeting_rooms')) {
    topics.add('Intervals');
  }
  if (text.includes('sliding_window') || text.includes('window')) {
    topics.add('Sliding Window');
  }
  if (text.includes('binary_search') || text.includes('search_insert') || text.includes('rotated_sorted')) {
    topics.add('Binary Search');
  }
  if (text.includes('two_sum') || text.includes('three_sum') || text.includes('four_sum')) {
    topics.add('Hash Table');
    topics.add('Two Pointers');
  }
  if (text.includes('permutation') || text.includes('permutations') || text.includes('combination') || text.includes('subsets') || text.includes('generate_parentheses')) {
    topics.add('Backtracking');
  }
  if (text.includes('dynamic') || text.includes('dp') || text.includes('climbing_stairs') || text.includes('house_robber') || text.includes('edit_distance') || text.includes('longest_common_subsequence') || text.includes('partition_equal_subset_sum') || text.includes('unique_paths')) {
    topics.add('Dynamic Programming');
  }
  if (text.includes('bit') || text.includes('bits') || text.includes('xor') || text.includes('hamming')) {
    topics.add('Bit Manipulation');
  }
  if (text.includes('greedy') || text.includes('jump_game') || text.includes('meeting_rooms') || text.includes('non_overlapping_intervals')) {
    topics.add('Greedy');
  }
  if (text.includes('lru') || text.includes('cache')) {
    topics.add('Design');
  }
  if (isMathTask(text)) {
    topics.add('Math');
  }

  if (topics.size === 0) {
    topics.add('General');
  }

  return Array.from(topics);
}

function inferDifficulty(challengeId) {
  if (HARD_OVERRIDES.has(challengeId)) {
    return 'hard';
  }
  if (MEDIUM_OVERRIDES.has(challengeId)) {
    return 'medium';
  }
  return 'easy';
}

async function readCache(cachePath) {
  if (!cachePath) {
    return { data: {}, dirty: false };
  }
  try {
    const raw = await readFile(cachePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return { data: parsed, dirty: false };
    }
    return { data: {}, dirty: false };
  } catch {
    return { data: {}, dirty: false };
  }
}

async function writeCache(cachePath, cache) {
  if (!cachePath) {
    return;
  }
  await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
}

async function fetchLeetCodeQuestion(slug) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: 'https://leetcode.com',
      referer: `https://leetcode.com/problems/${slug}/`
    },
    body: JSON.stringify({
      query: QUESTION_QUERY,
      variables: { titleSlug: slug }
    })
  });

  if (!response.ok) {
    return null;
  }
  const payload = await response.json();
  const question = payload?.data?.question;
  if (!question) {
    return null;
  }
  return {
    difficulty: normalizeDifficulty(question.difficulty),
    topics: normalizeTopics((question.topicTags || []).map(tag => tag?.name).filter(Boolean))
  };
}

async function resolveMetadata(challenge, options, cacheState) {
  const slug = slugForChallengeId(challenge.id);

  if (!options.noLeetCode && cacheState?.data?.[slug]) {
    return cacheState.data[slug];
  }

  if (!options.noLeetCode) {
    try {
      const result = await fetchLeetCodeQuestion(slug);
      if (result && (result.difficulty || (result.topics && result.topics.length > 0))) {
        if (!options.noCache && cacheState) {
          cacheState.data[slug] = result;
          cacheState.dirty = true;
        }
        return result;
      }
    } catch {
      // Ignore fetch errors, fall back to heuristics.
    }
  }

  return {
    difficulty: inferDifficulty(challenge.id),
    topics: inferTopics(challenge.id)
  };
}

async function backfillChallengeMetadata() {
  const options = parseArgs(process.argv.slice(2));
  initDatabase();

  const challenges = getAllChallenges();
  const cacheState = options.noCache ? { data: {}, dirty: false } : await readCache(options.cacheFile);

  let updated = 0;
  let skipped = 0;
  let processed = 0;

  for (const challenge of challenges) {
    if (options.limit && processed >= options.limit) {
      break;
    }
    processed += 1;

    const currentTopics = parseTopics(challenge.topics);
    const hasTopics = currentTopics.length > 0;
    const hasDifficulty = typeof challenge.difficulty === 'string' && challenge.difficulty.trim().length > 0;

    if (!options.force && hasTopics && hasDifficulty) {
      skipped += 1;
      continue;
    }

    const metadata = await resolveMetadata(challenge, options, cacheState);
    const updatePayload = {};

    if ((options.force || !hasDifficulty) && metadata?.difficulty) {
      updatePayload.difficulty = metadata.difficulty;
    }
    if ((options.force || !hasTopics) && metadata?.topics?.length) {
      updatePayload.topics = metadata.topics;
    }

    if (Object.keys(updatePayload).length === 0) {
      skipped += 1;
      continue;
    }

    if (!options.dryRun) {
      updateChallengeMetadata(challenge.id, updatePayload);
    }
    updated += 1;
  }

  if (cacheState.dirty && !options.noCache) {
    await writeCache(options.cacheFile, cacheState.data);
  }

  console.log(`Challenge metadata backfill complete. Updated ${updated}, skipped ${skipped}.`);
  closeDatabase();
}

if (process.argv[1] && process.argv[1].includes('backfillChallengeMetadata.js')) {
  backfillChallengeMetadata().catch((error) => {
    console.error('Challenge metadata backfill failed:', error.message);
    process.exitCode = 1;
  });
}
