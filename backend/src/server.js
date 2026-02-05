import express from 'express';
import cors from 'cors';
import { existsSync } from 'fs';
import { readFile, readdir, unlink, stat, writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';
import OpenAI from 'openai';
import { executeJavaCode } from './executors/javaExecutor.js';
import { executePythonCode } from './executors/pythonExecutor.js';
import { executeJavaScriptCode } from './executors/javascriptExecutor.js';
import { executeTypeScriptCode } from './executors/typescriptExecutor.js';
import { loadAdapter } from './adapters/index.js';
import { standardAdapterDefinitions } from './adapters/standardAdapterDefinitions.js';
import { initDatabase } from './db/database.js';
import {
  computeRetentionMetricsData,
  computeTopicRetentionMetricsData,
  getTopicRetentionMetrics,
  refreshRetentionMetrics
} from './db/retentionMetrics.js';
import {
  getChallengeById,
  getAllChallenges,
  insertChallenge,
  updateChallengeMetadata,
  getChallengeAdapterDefinition,
  getChallengeTestCases,
  getPrerequisites,
  getPrerequisiteEdges,
  setPrerequisites,
  getChallengeTree,
  setChallengeParent,
  getCompanyTiers,
  setCompanyTiers,
  getSubmissions as getSubmissionsFromDb,
  getAllSubmissions,
  getSubmissionsPage,
  getSubmissionsCount,
  getSubmissionCountsByChallenge,
  getSubmissionById as getSubmissionByIdFromDb,
  insertSubmission as insertSubmissionToDb,
  deleteSubmission as deleteSubmissionFromDb,
  updateSubmission as updateSubmissionInDb,
  updateSubmissionTechBar as updateSubmissionTechBarInDb,
  getLanguagePreference as getLanguagePreferenceFromDb,
  getLatestLanguagePreference as getLatestLanguagePreferenceFromDb,
  setLanguagePreference as setLanguagePreferenceInDb,
  insertFitnessSnapshot,
  getFitnessHistory,
  getRetentionMetrics,
  getNextChallengeRecommendation as getNextChallengeRecommendationFromDb,
  getRecommendationMixState as getRecommendationMixStateFromDb,
  upsertNextChallengeRecommendation as upsertNextChallengeRecommendationToDb,
  upsertRecommendationMixState as upsertRecommendationMixStateToDb
} from './db/queries.js';
import {
  getChallengeAssetContent,
  getChallengeTestCasesWithFallback,
  loadTestCasesFromFile
} from './db/challengeContent.js';
import { buildRecommendationHistoryHash } from './utils/recommendationCache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default challenge ID (configurable)
export const DEFAULT_CHALLENGE = 'two_sum';
const GLOBAL_LANGUAGE_PREFERENCE_KEY = '__global__';
const TECH_BAR_LABELS = new Set(['not_met', 'met', 'exceeds']);
const TECH_BAR_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const techBarDescriptionCache = new Map();
const DEFAULT_SUBMISSIONS_PAGE_SIZE = 50;
const MAX_SUBMISSIONS_PAGE_SIZE = 200;

// Challenge configuration
export const CHALLENGES = {
  lrucachewithttl: {
    name: 'LRU Cache with TTL',
    folder: 'lrucachewithttl',
    testFile: './testCases/lrucachewithttl.js',
    adapter: './adapters/lruCacheAdapter.js'
  },
  two_sum: {
    name: 'Two Sum',
    folder: 'two_sum',
    testFile: './testCases/twoSumTests.js',
    adapter: 'standard:twoSum:java'
  },
  contains_duplicate: {
    name: 'Contains Duplicate',
    folder: 'contains_duplicate',
    testFile: './testCases/containsDuplicateTests.js',
    adapter: 'standard:containsDuplicate:java'
  },
  top_k_frequent_elements: {
    name: 'Top K Frequent Elements',
    folder: 'top_k_frequent_elements',
    testFile: './testCases/topKFrequentElementsTests.js',
    adapter: './adapters/topKFrequentElementsAdapter.js'
  },
  number_of_islands: {
    name: 'Number of Islands',
    folder: 'number_of_islands',
    testFile: './testCases/numberOfIslandsTests.js',
    adapter: 'standard:numberOfIslands:java'
  },
  valid_parentheses: {
    name: 'Valid Parentheses',
    folder: 'valid_parentheses',
    testFile: './testCases/validParenthesesTests.js',
    adapter: 'standard:validParentheses:java'
  },
  valid_anagram: {
    name: 'Valid Anagram',
    folder: 'valid_anagram',
    testFile: './testCases/validAnagramTests.js',
    adapter: 'standard:validAnagram:java'
  },
  valid_palindrome: {
    name: 'Valid Palindrome',
    folder: 'valid_palindrome',
    testFile: './testCases/validPalindromeTests.js',
    adapter: 'standard:validPalindrome:java'
  },
  valid_palindrome_ii: {
    name: 'Valid Palindrome II',
    folder: 'valid_palindrome_ii',
    testFile: './testCases/validPalindromeIiTests.js',
    adapter: 'standard:validPalindromeIi:java'
  },
  permutation_in_string: {
    name: 'Permutation in String',
    folder: 'permutation_in_string',
    testFile: './testCases/permutationInStringTests.js',
    adapter: 'standard:permutationInString:java'
  },
  is_subsequence: {
    name: 'Is Subsequence',
    folder: 'is_subsequence',
    testFile: './testCases/isSubsequenceTests.js',
    adapter: 'standard:isSubsequence:java'
  },
  to_lower_case: {
    name: 'To Lower Case',
    folder: 'to_lower_case',
    testFile: './testCases/toLowerCaseTests.js',
    adapter: 'standard:toLowerCase:java'
  },
  rotting_oranges: {
    name: 'Rotting Oranges',
    folder: 'rotting_oranges',
    testFile: './testCases/rottingOrangesTests.js',
    adapter: 'standard:rottingOranges:java'
  },
  reverse_linked_list: {
    name: 'Reverse Linked List',
    folder: 'reverse_linked_list',
    testFile: './testCases/reverseLinkedListTests.js',
    adapter: './adapters/reverseLinkedListAdapter.js'
  },
  linked_list_cycle: {
    name: 'Linked List Cycle',
    folder: 'linked_list_cycle',
    testFile: './testCases/linkedListCycleTests.js',
    adapter: './adapters/linkedListCycleAdapter.js'
  },
  middle_of_linked_list: {
    name: 'Middle of the Linked List',
    folder: 'middle_of_linked_list',
    testFile: './testCases/middleOfLinkedListTests.js',
    adapter: './adapters/middleOfLinkedListAdapter.js'
  },
  remove_nth_node_from_end_of_list: {
    name: 'Remove Nth Node From End of List',
    folder: 'remove_nth_node_from_end_of_list',
    testFile: './testCases/removeNthNodeFromEndOfListTests.js',
    adapter: './adapters/removeNthNodeFromEndOfListAdapter.js'
  },
  merge_two_sorted_lists: {
    name: 'Merge Two Sorted Lists',
    folder: 'merge_two_sorted_lists',
    testFile: './testCases/mergeTwoSortedListsTests.js',
    adapter: './adapters/mergeTwoSortedListsAdapter.js'
  },
  intersection_of_two_linked_lists: {
    name: 'Intersection of Two Linked Lists',
    folder: 'intersection_of_two_linked_lists',
    testFile: './testCases/intersectionOfTwoLinkedListsTests.js',
    adapter: './adapters/intersectionOfTwoLinkedListsAdapter.js'
  },
  palindrome_linked_list: {
    name: 'Palindrome Linked List',
    folder: 'palindrome_linked_list',
    testFile: './testCases/palindromeLinkedListTests.js',
    adapter: './adapters/palindromeLinkedListAdapter.js'
  },
  longest_substring_without_repeating_characters: {
    name: 'Longest Substring Without Repeating Characters',
    folder: 'longest_substring_without_repeating_characters',
    testFile: './testCases/longestSubstringWithoutRepeatingCharactersTests.js',
    adapter: 'standard:longestSubstringWithoutRepeatingCharacters:java'
  },
  longest_repeating_character_replacement: {
    name: 'Longest Repeating Character Replacement',
    folder: 'longest_repeating_character_replacement',
    testFile: './testCases/longestRepeatingCharacterReplacementTests.js',
    adapter: 'standard:longestRepeatingCharacterReplacement:java'
  },
  best_time_to_buy_and_sell_stock: {
    name: 'Best Time to Buy and Sell Stock',
    folder: 'best_time_to_buy_and_sell_stock',
    testFile: './testCases/bestTimeToBuyAndSellStockTests.js',
    adapter: 'standard:bestTimeToBuyAndSellStock:java'
  },
  remove_duplicates_from_sorted_array: {
    name: 'Remove Duplicates from Sorted Array',
    folder: 'remove_duplicates_from_sorted_array',
    testFile: './testCases/removeDuplicatesFromSortedArrayTests.js',
    adapter: 'standard:removeDuplicatesFromSortedArray:java'
  },
  remove_element: {
    name: 'Remove Element',
    folder: 'remove_element',
    testFile: './testCases/removeElementTests.js',
    adapter: 'standard:removeElement:java'
  },
  maximum_average_subarray_i: {
    name: 'Maximum Average Subarray I',
    folder: 'maximum_average_subarray_i',
    testFile: './testCases/maximumAverageSubarrayITests.js',
    adapter: 'standard:maximumAverageSubarrayI:java'
  },
  coin_change: {
    name: 'Coin Change',
    folder: 'coin_change',
    testFile: './testCases/coinChangeTests.js',
    adapter: 'standard:coinChange:java'
  },
  paginated_article_stats: {
    name: 'Paginated Article Stats',
    folder: 'paginated_article_stats',
    testFile: './testCases/paginatedArticleStatsTests.js',
    adapter: './adapters/paginatedArticleStatsAdapter.js'
  },
  invert_binary_tree: {
    name: 'Invert Binary Tree',
    folder: 'invert_binary_tree',
    testFile: './testCases/invertBinaryTreeTests.js',
    adapter: './adapters/invertBinaryTreeAdapter.js'
  },
  validate_binary_search_tree: {
    name: 'Validate Binary Search Tree',
    folder: 'validate_binary_search_tree',
    testFile: './testCases/validateBinarySearchTreeTests.js',
    adapter: './adapters/validateBinarySearchTreeAdapter.js'
  },
  binary_search: {
    name: 'Binary Search',
    folder: 'binary_search',
    testFile: './testCases/binarySearchTests.js',
    adapter: 'standard:binarySearch:java'
  },
  fibonacci_number: {
    name: 'Fibonacci Number',
    folder: 'fibonacci_number',
    testFile: './testCases/fibonacciNumberTests.js',
    adapter: 'standard:fibonacciNumber:java'
  },
  move_zeroes: {
    name: 'Move Zeroes',
    folder: 'move_zeroes',
    testFile: './testCases/moveZeroesTests.js',
    adapter: 'standard:moveZeroes:java'
  },
  reverse_string: {
    name: 'Reverse String',
    folder: 'reverse_string',
    testFile: './testCases/reverseStringTests.js',
    adapter: 'standard:reverseString:java'
  },
  first_unique_character: {
    name: 'First Unique Character',
    folder: 'first_unique_character',
    testFile: './testCases/firstUniqueCharacterTests.js',
    adapter: 'standard:firstUniqueCharacter:java'
  },
  majority_element: {
    name: 'Majority Element',
    folder: 'majority_element',
    testFile: './testCases/majorityElementTests.js',
    adapter: 'standard:majorityElement:java'
  },
  maximum_subarray: {
    name: 'Maximum Subarray',
    folder: 'maximum_subarray',
    testFile: './testCases/maximumSubarrayTests.js',
    adapter: 'standard:maximumSubarray:java'
  },
  valid_mountain_array: {
    name: 'Valid Mountain Array',
    folder: 'valid_mountain_array',
    testFile: './testCases/validMountainArrayTests.js',
    adapter: 'standard:validMountainArray:java'
  },
  single_number: {
    name: 'Single Number',
    folder: 'single_number',
    testFile: './testCases/singleNumberTests.js',
    adapter: 'standard:singleNumber:java'
  },
  climbing_stairs: {
    name: 'Climbing Stairs',
    folder: 'climbing_stairs',
    testFile: './testCases/climbingStairsTests.js',
    adapter: 'standard:climbingStairs:java'
  },
  two_sum_ii_input_sorted: {
    name: 'Two Sum II (Input Sorted)',
    folder: 'two_sum_ii_input_sorted',
    testFile: './testCases/twoSumIiInputSortedTests.js',
    adapter: 'standard:twoSumIiInputSorted:java'
  },
  three_sum: {
    name: '3Sum',
    folder: 'three_sum',
    testFile: './testCases/threeSumTests.js',
    adapter: './adapters/threeSumAdapter.js'
  },
  four_sum: {
    name: '4Sum',
    folder: 'four_sum',
    testFile: './testCases/fourSumTests.js',
    adapter: 'standard:fourSum:java'
  },
  container_with_most_water: {
    name: 'Container With Most Water',
    folder: 'container_with_most_water',
    testFile: './testCases/containerWithMostWaterTests.js',
    adapter: 'standard:containerWithMostWater:java'
  },
  trapping_rain_water: {
    name: 'Trapping Rain Water',
    folder: 'trapping_rain_water',
    testFile: './testCases/trappingRainWaterTests.js',
    adapter: 'standard:trappingRainWater:java'
  },
  product_of_array_except_self: {
    name: 'Product of Array Except Self',
    folder: 'product_of_array_except_self',
    testFile: './testCases/productOfArrayExceptSelfTests.js',
    adapter: 'standard:productOfArrayExceptSelf:java'
  },
  find_minimum_in_rotated_sorted_array: {
    name: 'Find Minimum in Rotated Sorted Array',
    folder: 'find_minimum_in_rotated_sorted_array',
    testFile: './testCases/findMinimumInRotatedSortedArrayTests.js',
    adapter: 'standard:findMinimumInRotatedSortedArray:java'
  },
  search_in_rotated_sorted_array: {
    name: 'Search in Rotated Sorted Array',
    folder: 'search_in_rotated_sorted_array',
    testFile: './testCases/searchInRotatedSortedArrayTests.js',
    adapter: 'standard:searchInRotatedSortedArray:java'
  },
  merge_intervals: {
    name: 'Merge Intervals',
    folder: 'merge_intervals',
    testFile: './testCases/mergeIntervalsTests.js',
    adapter: 'standard:mergeIntervals:java'
  },
  insert_interval: {
    name: 'Insert Interval',
    folder: 'insert_interval',
    testFile: './testCases/insertIntervalTests.js',
    adapter: 'standard:insertInterval:java'
  },
  non_overlapping_intervals: {
    name: 'Non-overlapping Intervals',
    folder: 'non_overlapping_intervals',
    testFile: './testCases/nonOverlappingIntervalsTests.js',
    adapter: 'standard:nonOverlappingIntervals:java'
  },
  meeting_rooms: {
    name: 'Meeting Rooms',
    folder: 'meeting_rooms',
    testFile: './testCases/meetingRoomsTests.js',
    adapter: 'standard:meetingRooms:java'
  },
  meeting_rooms_ii: {
    name: 'Meeting Rooms II',
    folder: 'meeting_rooms_ii',
    testFile: './testCases/meetingRoomsIiTests.js',
    adapter: 'standard:meetingRoomsIi:java'
  },
  spiral_matrix: {
    name: 'Spiral Matrix',
    folder: 'spiral_matrix',
    testFile: './testCases/spiralMatrixTests.js',
    adapter: 'standard:spiralMatrix:java'
  },
  rotate_image: {
    name: 'Rotate Image',
    folder: 'rotate_image',
    testFile: './testCases/rotateImageTests.js',
    adapter: 'standard:rotateImage:java'
  },
  set_matrix_zeroes: {
    name: 'Set Matrix Zeroes',
    folder: 'set_matrix_zeroes',
    testFile: './testCases/setMatrixZeroesTests.js',
    adapter: 'standard:setMatrixZeroes:java'
  },
  word_search: {
    name: 'Word Search',
    folder: 'word_search',
    testFile: './testCases/wordSearchTests.js',
    adapter: 'standard:wordSearch:java'
  },
  letter_combinations_of_a_phone_number: {
    name: 'Letter Combinations of a Phone Number',
    folder: 'letter_combinations_of_a_phone_number',
    testFile: './testCases/letterCombinationsOfAPhoneNumberTests.js',
    adapter: 'standard:letterCombinationsOfAPhoneNumber:java'
  },
  generate_parentheses: {
    name: 'Generate Parentheses',
    folder: 'generate_parentheses',
    testFile: './testCases/generateParenthesesTests.js',
    adapter: 'standard:generateParentheses:java'
  },
  combination_sum: {
    name: 'Combination Sum',
    folder: 'combination_sum',
    testFile: './testCases/combinationSumTests.js',
    adapter: 'standard:combinationSum:java'
  },
  combination_sum_ii: {
    name: 'Combination Sum II',
    folder: 'combination_sum_ii',
    testFile: './testCases/combinationSumIiTests.js',
    adapter: 'standard:combinationSumIi:java'
  },
  permutations: {
    name: 'Permutations',
    folder: 'permutations',
    testFile: './testCases/permutationsTests.js',
    adapter: 'standard:permutations:java'
  },
  subsets: {
    name: 'Subsets',
    folder: 'subsets',
    testFile: './testCases/subsetsTests.js',
    adapter: 'standard:subsets:java'
  },
  subsets_ii: {
    name: 'Subsets II',
    folder: 'subsets_ii',
    testFile: './testCases/subsetsIiTests.js',
    adapter: 'standard:subsetsIi:java'
  },
  group_anagrams: {
    name: 'Group Anagrams',
    folder: 'group_anagrams',
    testFile: './testCases/groupAnagramsTests.js',
    adapter: './adapters/groupAnagramsAdapter.js'
  },
  longest_common_prefix: {
    name: 'Longest Common Prefix',
    folder: 'longest_common_prefix',
    testFile: './testCases/longestCommonPrefixTests.js',
    adapter: 'standard:longestCommonPrefix:java'
  },
  valid_sudoku: {
    name: 'Valid Sudoku',
    folder: 'valid_sudoku',
    testFile: './testCases/validSudokuTests.js',
    adapter: 'standard:validSudoku:java'
  },
  sudoku_solver: {
    name: 'Sudoku Solver',
    folder: 'sudoku_solver',
    testFile: './testCases/sudokuSolverTests.js',
    adapter: 'standard:sudokuSolver:java'
  },
  kth_largest_element_in_an_array: {
    name: 'Kth Largest Element in an Array',
    folder: 'kth_largest_element_in_an_array',
    testFile: './testCases/kthLargestElementInAnArrayTests.js',
    adapter: 'standard:kthLargestElementInAnArray:java'
  },
  top_k_frequent_words: {
    name: 'Top K Frequent Words',
    folder: 'top_k_frequent_words',
    testFile: './testCases/topKFrequentWordsTests.js',
    adapter: 'standard:topKFrequentWords:java'
  },
  sliding_window_maximum: {
    name: 'Sliding Window Maximum',
    folder: 'sliding_window_maximum',
    testFile: './testCases/slidingWindowMaximumTests.js',
    adapter: 'standard:slidingWindowMaximum:java'
  },
  minimum_window_substring: {
    name: 'Minimum Window Substring',
    folder: 'minimum_window_substring',
    testFile: './testCases/minimumWindowSubstringTests.js',
    adapter: 'standard:minimumWindowSubstring:java'
  },
  add_one: {
    name: 'Add One',
    folder: 'add_one',
    testFile: './testCases/addOneTests.js',
    adapter: './adapters/addOneAdapter.js'
  },
  add_two: {
    name: 'Add Two',
    folder: 'add_two',
    testFile: './testCases/addTwoTests.js',
    adapter: './adapters/addTwoAdapter.js'
  },
  subtract_one: {
    name: 'Subtract One',
    folder: 'subtract_one',
    testFile: './testCases/subtractOneTests.js',
    adapter: './adapters/subtractOneAdapter.js'
  },
  subtract_two: {
    name: 'Subtract Two',
    folder: 'subtract_two',
    testFile: './testCases/subtractTwoTests.js',
    adapter: './adapters/subtractTwoAdapter.js'
  },
  multiply_by_two: {
    name: 'Multiply By Two',
    folder: 'multiply_by_two',
    testFile: './testCases/multiplyByTwoTests.js',
    adapter: './adapters/multiplyByTwoAdapter.js'
  },
  multiply_by_three: {
    name: 'Multiply By Three',
    folder: 'multiply_by_three',
    testFile: './testCases/multiplyByThreeTests.js',
    adapter: './adapters/multiplyByThreeAdapter.js'
  },
  square_number: {
    name: 'Square Number',
    folder: 'square_number',
    testFile: './testCases/squareNumberTests.js',
    adapter: './adapters/squareNumberAdapter.js'
  },
  squares_of_sorted_array: {
    name: 'Squares of a Sorted Array',
    folder: 'squares_of_sorted_array',
    testFile: './testCases/squaresOfSortedArrayTests.js',
    adapter: './adapters/squaresOfSortedArrayAdapter.js'
  },
  cube_number: {
    name: 'Cube Number',
    folder: 'cube_number',
    testFile: './testCases/cubeNumberTests.js',
    adapter: './adapters/cubeNumberAdapter.js'
  },
  absolute_value: {
    name: 'Absolute Value',
    folder: 'absolute_value',
    testFile: './testCases/absoluteValueTests.js',
    adapter: './adapters/absoluteValueAdapter.js'
  },
  negate_number: {
    name: 'Negate Number',
    folder: 'negate_number',
    testFile: './testCases/negateNumberTests.js',
    adapter: './adapters/negateNumberAdapter.js'
  },
  is_even: {
    name: 'Is Even',
    folder: 'is_even',
    testFile: './testCases/isEvenTests.js',
    adapter: './adapters/isEvenAdapter.js'
  },
  is_odd: {
    name: 'Is Odd',
    folder: 'is_odd',
    testFile: './testCases/isOddTests.js',
    adapter: './adapters/isOddAdapter.js'
  },
  is_positive: {
    name: 'Is Positive',
    folder: 'is_positive',
    testFile: './testCases/isPositiveTests.js',
    adapter: './adapters/isPositiveAdapter.js'
  },
  is_negative: {
    name: 'Is Negative',
    folder: 'is_negative',
    testFile: './testCases/isNegativeTests.js',
    adapter: './adapters/isNegativeAdapter.js'
  },
  sign_of_number: {
    name: 'Sign Of Number',
    folder: 'sign_of_number',
    testFile: './testCases/signOfNumberTests.js',
    adapter: './adapters/signOfNumberAdapter.js'
  },
  sum_from_one_to_n: {
    name: 'Sum From One To N',
    folder: 'sum_from_one_to_n',
    testFile: './testCases/sumFromOneToNTests.js',
    adapter: './adapters/sumFromOneToNAdapter.js'
  },
  factorial_number: {
    name: 'Factorial Number',
    folder: 'factorial_number',
    testFile: './testCases/factorialNumberTests.js',
    adapter: './adapters/factorialNumberAdapter.js'
  },
  count_bits: {
    name: 'Count Bits',
    folder: 'count_bits',
    testFile: './testCases/countBitsTests.js',
    adapter: './adapters/countBitsAdapter.js'
  },
  is_power_of_two: {
    name: 'Is Power Of Two',
    folder: 'is_power_of_two',
    testFile: './testCases/isPowerOfTwoTests.js',
    adapter: './adapters/isPowerOfTwoAdapter.js'
  },
  reverse_digits: {
    name: 'Reverse Digits',
    folder: 'reverse_digits',
    testFile: './testCases/reverseDigitsTests.js',
    adapter: './adapters/reverseDigitsAdapter.js'
  },
  sum_of_digits: {
    name: 'Sum Of Digits',
    folder: 'sum_of_digits',
    testFile: './testCases/sumOfDigitsTests.js',
    adapter: './adapters/sumOfDigitsAdapter.js'
  },
  product_of_digits: {
    name: 'Product Of Digits',
    folder: 'product_of_digits',
    testFile: './testCases/productOfDigitsTests.js',
    adapter: './adapters/productOfDigitsAdapter.js'
  },
  digital_root: {
    name: 'Digital Root',
    folder: 'digital_root',
    testFile: './testCases/digitalRootTests.js',
    adapter: './adapters/digitalRootAdapter.js'
  },
  number_of_digits: {
    name: 'Number Of Digits',
    folder: 'number_of_digits',
    testFile: './testCases/numberOfDigitsTests.js',
    adapter: './adapters/numberOfDigitsAdapter.js'
  },
  clamp_to_hundred: {
    name: 'Clamp To Hundred',
    folder: 'clamp_to_hundred',
    testFile: './testCases/clampToHundredTests.js',
    adapter: './adapters/clampToHundredAdapter.js'
  },
  to_upper_case: {
    name: 'To Upper Case',
    folder: 'to_upper_case',
    testFile: './testCases/toUpperCaseTests.js',
    adapter: './adapters/toUpperCaseAdapter.js'
  },
  string_length: {
    name: 'String Length',
    folder: 'string_length',
    testFile: './testCases/stringLengthTests.js',
    adapter: './adapters/stringLengthAdapter.js'
  },
  count_vowels: {
    name: 'Count Vowels',
    folder: 'count_vowels',
    testFile: './testCases/countVowelsTests.js',
    adapter: './adapters/countVowelsAdapter.js'
  },
  count_consonants: {
    name: 'Count Consonants',
    folder: 'count_consonants',
    testFile: './testCases/countConsonantsTests.js',
    adapter: './adapters/countConsonantsAdapter.js'
  },
  reverse_words: {
    name: 'Reverse Words',
    folder: 'reverse_words',
    testFile: './testCases/reverseWordsTests.js',
    adapter: './adapters/reverseWordsAdapter.js'
  },
  remove_spaces: {
    name: 'Remove Spaces',
    folder: 'remove_spaces',
    testFile: './testCases/removeSpacesTests.js',
    adapter: './adapters/removeSpacesAdapter.js'
  },
  trim_whitespace: {
    name: 'Trim Whitespace',
    folder: 'trim_whitespace',
    testFile: './testCases/trimWhitespaceTests.js',
    adapter: './adapters/trimWhitespaceAdapter.js'
  },
  collapse_spaces: {
    name: 'Collapse Spaces',
    folder: 'collapse_spaces',
    testFile: './testCases/collapseSpacesTests.js',
    adapter: './adapters/collapseSpacesAdapter.js'
  },
  replace_spaces_with_hyphen: {
    name: 'Replace Spaces With Hyphen',
    folder: 'replace_spaces_with_hyphen',
    testFile: './testCases/replaceSpacesWithHyphenTests.js',
    adapter: './adapters/replaceSpacesWithHyphenAdapter.js'
  },
  remove_vowels: {
    name: 'Remove Vowels',
    folder: 'remove_vowels',
    testFile: './testCases/removeVowelsTests.js',
    adapter: './adapters/removeVowelsAdapter.js'
  },
  replace_vowels_with_star: {
    name: 'Replace Vowels With Star',
    folder: 'replace_vowels_with_star',
    testFile: './testCases/replaceVowelsWithStarTests.js',
    adapter: './adapters/replaceVowelsWithStarAdapter.js'
  },
  contains_digit: {
    name: 'Contains Digit',
    folder: 'contains_digit',
    testFile: './testCases/containsDigitTests.js',
    adapter: './adapters/containsDigitAdapter.js'
  },
  contains_vowel: {
    name: 'Contains Vowel',
    folder: 'contains_vowel',
    testFile: './testCases/containsVowelTests.js',
    adapter: './adapters/containsVowelAdapter.js'
  },
  is_all_uppercase: {
    name: 'Is All Uppercase',
    folder: 'is_all_uppercase',
    testFile: './testCases/isAllUppercaseTests.js',
    adapter: './adapters/isAllUppercaseAdapter.js'
  },
  is_all_lowercase: {
    name: 'Is All Lowercase',
    folder: 'is_all_lowercase',
    testFile: './testCases/isAllLowercaseTests.js',
    adapter: './adapters/isAllLowercaseAdapter.js'
  },
  first_character: {
    name: 'First Character',
    folder: 'first_character',
    testFile: './testCases/firstCharacterTests.js',
    adapter: './adapters/firstCharacterAdapter.js'
  },
  last_character: {
    name: 'Last Character',
    folder: 'last_character',
    testFile: './testCases/lastCharacterTests.js',
    adapter: './adapters/lastCharacterAdapter.js'
  },
  repeat_twice: {
    name: 'Repeat Twice',
    folder: 'repeat_twice',
    testFile: './testCases/repeatTwiceTests.js',
    adapter: './adapters/repeatTwiceAdapter.js'
  },
  starts_with_vowel: {
    name: 'Starts With Vowel',
    folder: 'starts_with_vowel',
    testFile: './testCases/startsWithVowelTests.js',
    adapter: './adapters/startsWithVowelAdapter.js'
  },
  ends_with_exclamation: {
    name: 'Ends With Exclamation',
    folder: 'ends_with_exclamation',
    testFile: './testCases/endsWithExclamationTests.js',
    adapter: './adapters/endsWithExclamationAdapter.js'
  },
  count_uppercase: {
    name: 'Count Uppercase',
    folder: 'count_uppercase',
    testFile: './testCases/countUppercaseTests.js',
    adapter: './adapters/countUppercaseAdapter.js'
  },
  count_lowercase: {
    name: 'Count Lowercase',
    folder: 'count_lowercase',
    testFile: './testCases/countLowercaseTests.js',
    adapter: './adapters/countLowercaseAdapter.js'
  },
  toggle_case: {
    name: 'Toggle Case',
    folder: 'toggle_case',
    testFile: './testCases/toggleCaseTests.js',
    adapter: './adapters/toggleCaseAdapter.js'
  },
  remove_digits: {
    name: 'Remove Digits',
    folder: 'remove_digits',
    testFile: './testCases/removeDigitsTests.js',
    adapter: './adapters/removeDigitsAdapter.js'
  },
  only_letters: {
    name: 'Only Letters',
    folder: 'only_letters',
    testFile: './testCases/onlyLettersTests.js',
    adapter: './adapters/onlyLettersAdapter.js'
  }
,
  add_three: {
    name: 'Add Three',
    folder: 'add_three',
    testFile: './testCases/addThreeTests.js',
    adapter: './adapters/addThreeAdapter.js'
  },
  subtract_three: {
    name: 'Subtract Three',
    folder: 'subtract_three',
    testFile: './testCases/subtractThreeTests.js',
    adapter: './adapters/subtractThreeAdapter.js'
  },
  multiply_by_four: {
    name: 'Multiply By Four',
    folder: 'multiply_by_four',
    testFile: './testCases/multiplyByFourTests.js',
    adapter: './adapters/multiplyByFourAdapter.js'
  },
  multiply_by_five: {
    name: 'Multiply By Five',
    folder: 'multiply_by_five',
    testFile: './testCases/multiplyByFiveTests.js',
    adapter: './adapters/multiplyByFiveAdapter.js'
  },
  square_plus_one: {
    name: 'Square Plus One',
    folder: 'square_plus_one',
    testFile: './testCases/squarePlusOneTests.js',
    adapter: './adapters/squarePlusOneAdapter.js'
  },
  cube_minus_one: {
    name: 'Cube Minus One',
    folder: 'cube_minus_one',
    testFile: './testCases/cubeMinusOneTests.js',
    adapter: './adapters/cubeMinusOneAdapter.js'
  },
  max_of_two_numbers: {
    name: 'Max Of Two Numbers',
    folder: 'max_of_two_numbers',
    testFile: './testCases/maxOfTwoNumbersTests.js',
    adapter: './adapters/maxOfTwoNumbersAdapter.js'
  },
  min_of_two_numbers: {
    name: 'Min Of Two Numbers',
    folder: 'min_of_two_numbers',
    testFile: './testCases/minOfTwoNumbersTests.js',
    adapter: './adapters/minOfTwoNumbersAdapter.js'
  },
  max_of_three_numbers: {
    name: 'Max Of Three Numbers',
    folder: 'max_of_three_numbers',
    testFile: './testCases/maxOfThreeNumbersTests.js',
    adapter: './adapters/maxOfThreeNumbersAdapter.js'
  },
  min_of_three_numbers: {
    name: 'Min Of Three Numbers',
    folder: 'min_of_three_numbers',
    testFile: './testCases/minOfThreeNumbersTests.js',
    adapter: './adapters/minOfThreeNumbersAdapter.js'
  },
  absolute_difference: {
    name: 'Absolute Difference',
    folder: 'absolute_difference',
    testFile: './testCases/absoluteDifferenceTests.js',
    adapter: './adapters/absoluteDifferenceAdapter.js'
  },
  sum_of_squares: {
    name: 'Sum Of Squares',
    folder: 'sum_of_squares',
    testFile: './testCases/sumOfSquaresTests.js',
    adapter: './adapters/sumOfSquaresAdapter.js'
  },
  is_zero: {
    name: 'Is Zero',
    folder: 'is_zero',
    testFile: './testCases/isZeroTests.js',
    adapter: './adapters/isZeroAdapter.js'
  },
  is_multiple_of_three: {
    name: 'Is Multiple Of Three',
    folder: 'is_multiple_of_three',
    testFile: './testCases/isMultipleOfThreeTests.js',
    adapter: './adapters/isMultipleOfThreeAdapter.js'
  },
  clamp_to_range: {
    name: 'Clamp To Range',
    folder: 'clamp_to_range',
    testFile: './testCases/clampToRangeTests.js',
    adapter: './adapters/clampToRangeAdapter.js'
  },
  average_of_two_numbers: {
    name: 'Average Of Two Numbers',
    folder: 'average_of_two_numbers',
    testFile: './testCases/averageOfTwoNumbersTests.js',
    adapter: './adapters/averageOfTwoNumbersAdapter.js'
  },
  sum_of_array: {
    name: 'Sum Of Array',
    folder: 'sum_of_array',
    testFile: './testCases/sumOfArrayTests.js',
    adapter: './adapters/sumOfArrayAdapter.js'
  },
  product_of_array: {
    name: 'Product Of Array',
    folder: 'product_of_array',
    testFile: './testCases/productOfArrayTests.js',
    adapter: './adapters/productOfArrayAdapter.js'
  },
  max_in_array: {
    name: 'Max In Array',
    folder: 'max_in_array',
    testFile: './testCases/maxInArrayTests.js',
    adapter: './adapters/maxInArrayAdapter.js'
  },
  min_in_array: {
    name: 'Min In Array',
    folder: 'min_in_array',
    testFile: './testCases/minInArrayTests.js',
    adapter: './adapters/minInArrayAdapter.js'
  },
  average_of_array: {
    name: 'Average Of Array',
    folder: 'average_of_array',
    testFile: './testCases/averageOfArrayTests.js',
    adapter: './adapters/averageOfArrayAdapter.js'
  },
  count_even_numbers: {
    name: 'Count Even Numbers',
    folder: 'count_even_numbers',
    testFile: './testCases/countEvenNumbersTests.js',
    adapter: './adapters/countEvenNumbersAdapter.js'
  },
  count_odd_numbers: {
    name: 'Count Odd Numbers',
    folder: 'count_odd_numbers',
    testFile: './testCases/countOddNumbersTests.js',
    adapter: './adapters/countOddNumbersAdapter.js'
  },
  count_positive_numbers: {
    name: 'Count Positive Numbers',
    folder: 'count_positive_numbers',
    testFile: './testCases/countPositiveNumbersTests.js',
    adapter: './adapters/countPositiveNumbersAdapter.js'
  },
  count_negative_numbers: {
    name: 'Count Negative Numbers',
    folder: 'count_negative_numbers',
    testFile: './testCases/countNegativeNumbersTests.js',
    adapter: './adapters/countNegativeNumbersAdapter.js'
  },
  count_zeroes: {
    name: 'Count Zeroes',
    folder: 'count_zeroes',
    testFile: './testCases/countZeroesTests.js',
    adapter: './adapters/countZeroesAdapter.js'
  },
  index_of_target: {
    name: 'Index Of Target',
    folder: 'index_of_target',
    testFile: './testCases/indexOfTargetTests.js',
    adapter: './adapters/indexOfTargetAdapter.js'
  },
  last_index_of_target: {
    name: 'Last Index Of Target',
    folder: 'last_index_of_target',
    testFile: './testCases/lastIndexOfTargetTests.js',
    adapter: './adapters/lastIndexOfTargetAdapter.js'
  },
  contains_target: {
    name: 'Contains Target',
    folder: 'contains_target',
    testFile: './testCases/containsTargetTests.js',
    adapter: './adapters/containsTargetAdapter.js'
  },
  reverse_array: {
    name: 'Reverse Array',
    folder: 'reverse_array',
    testFile: './testCases/reverseArrayTests.js',
    adapter: './adapters/reverseArrayAdapter.js'
  },
  rotate_left_by_one: {
    name: 'Rotate Left By One',
    folder: 'rotate_left_by_one',
    testFile: './testCases/rotateLeftByOneTests.js',
    adapter: './adapters/rotateLeftByOneAdapter.js'
  },
  prefix_sums: {
    name: 'Prefix Sums',
    folder: 'prefix_sums',
    testFile: './testCases/prefixSumsTests.js',
    adapter: './adapters/prefixSumsAdapter.js'
  },
  running_max: {
    name: 'Running Max',
    folder: 'running_max',
    testFile: './testCases/runningMaxTests.js',
    adapter: './adapters/runningMaxAdapter.js'
  },
  count_greater_than: {
    name: 'Count Greater Than',
    folder: 'count_greater_than',
    testFile: './testCases/countGreaterThanTests.js',
    adapter: './adapters/countGreaterThanAdapter.js'
  },
  count_words: {
    name: 'Count Words',
    folder: 'count_words',
    testFile: './testCases/countWordsTests.js',
    adapter: './adapters/countWordsAdapter.js'
  },
  is_all_digits: {
    name: 'Is All Digits',
    folder: 'is_all_digits',
    testFile: './testCases/isAllDigitsTests.js',
    adapter: './adapters/isAllDigitsAdapter.js'
  },
  starts_with_capital: {
    name: 'Starts With Capital',
    folder: 'starts_with_capital',
    testFile: './testCases/startsWithCapitalTests.js',
    adapter: './adapters/startsWithCapitalAdapter.js'
  },
  swap_first_last_char: {
    name: 'Swap First Last Char',
    folder: 'swap_first_last_char',
    testFile: './testCases/swapFirstLastCharTests.js',
    adapter: './adapters/swapFirstLastCharAdapter.js'
  },
  replace_spaces_with_underscore: {
    name: 'Replace Spaces With Underscore',
    folder: 'replace_spaces_with_underscore',
    testFile: './testCases/replaceSpacesWithUnderscoreTests.js',
    adapter: './adapters/replaceSpacesWithUnderscoreAdapter.js'
  },
  count_occurrences_of_char: {
    name: 'Count Occurrences Of Char',
    folder: 'count_occurrences_of_char',
    testFile: './testCases/countOccurrencesOfCharTests.js',
    adapter: './adapters/countOccurrencesOfCharAdapter.js'
  },
  first_index_of_char: {
    name: 'First Index Of Char',
    folder: 'first_index_of_char',
    testFile: './testCases/firstIndexOfCharTests.js',
    adapter: './adapters/firstIndexOfCharAdapter.js'
  },
  last_index_of_char: {
    name: 'Last Index Of Char',
    folder: 'last_index_of_char',
    testFile: './testCases/lastIndexOfCharTests.js',
    adapter: './adapters/lastIndexOfCharAdapter.js'
  },
  repeat_n_times: {
    name: 'Repeat N Times',
    folder: 'repeat_n_times',
    testFile: './testCases/repeatNTimesTests.js',
    adapter: './adapters/repeatNTimesAdapter.js'
  },
  join_with_comma: {
    name: 'Join With Comma',
    folder: 'join_with_comma',
    testFile: './testCases/joinWithCommaTests.js',
    adapter: './adapters/joinWithCommaAdapter.js'
  },
  longest_word_length: {
    name: 'Longest Word Length',
    folder: 'longest_word_length',
    testFile: './testCases/longestWordLengthTests.js',
    adapter: './adapters/longestWordLengthAdapter.js'
  },
  transpose_matrix: {
    name: 'Transpose Matrix',
    folder: 'transpose_matrix',
    testFile: './testCases/transposeMatrixTests.js',
    adapter: './adapters/transposeMatrixAdapter.js'
  },
  diagonal_sum: {
    name: 'Diagonal Sum',
    folder: 'diagonal_sum',
    testFile: './testCases/diagonalSumTests.js',
    adapter: './adapters/diagonalSumAdapter.js'
  },
  row_sums: {
    name: 'Row Sums',
    folder: 'row_sums',
    testFile: './testCases/rowSumsTests.js',
    adapter: './adapters/rowSumsAdapter.js'
  },
  column_sums: {
    name: 'Column Sums',
    folder: 'column_sums',
    testFile: './testCases/columnSumsTests.js',
    adapter: './adapters/columnSumsAdapter.js'
  },
  count_positive_in_matrix: {
    name: 'Count Positive In Matrix',
    folder: 'count_positive_in_matrix',
    testFile: './testCases/countPositiveInMatrixTests.js',
    adapter: './adapters/countPositiveInMatrixAdapter.js'
  },

  add_four: {
    name: 'Add Four',
    folder: 'add_four',
    testFile: './testCases/addFourTests.js',
    adapter: './adapters/addFourAdapter.js'
  },
  add_five: {
    name: 'Add Five',
    folder: 'add_five',
    testFile: './testCases/addFiveTests.js',
    adapter: './adapters/addFiveAdapter.js'
  },
  add_six: {
    name: 'Add Six',
    folder: 'add_six',
    testFile: './testCases/addSixTests.js',
    adapter: './adapters/addSixAdapter.js'
  },
  add_seven: {
    name: 'Add Seven',
    folder: 'add_seven',
    testFile: './testCases/addSevenTests.js',
    adapter: './adapters/addSevenAdapter.js'
  },
  add_eight: {
    name: 'Add Eight',
    folder: 'add_eight',
    testFile: './testCases/addEightTests.js',
    adapter: './adapters/addEightAdapter.js'
  },
  add_nine: {
    name: 'Add Nine',
    folder: 'add_nine',
    testFile: './testCases/addNineTests.js',
    adapter: './adapters/addNineAdapter.js'
  },
  add_ten: {
    name: 'Add Ten',
    folder: 'add_ten',
    testFile: './testCases/addTenTests.js',
    adapter: './adapters/addTenAdapter.js'
  },
  subtract_four: {
    name: 'Subtract Four',
    folder: 'subtract_four',
    testFile: './testCases/subtractFourTests.js',
    adapter: './adapters/subtractFourAdapter.js'
  },
  subtract_five: {
    name: 'Subtract Five',
    folder: 'subtract_five',
    testFile: './testCases/subtractFiveTests.js',
    adapter: './adapters/subtractFiveAdapter.js'
  },
  subtract_six: {
    name: 'Subtract Six',
    folder: 'subtract_six',
    testFile: './testCases/subtractSixTests.js',
    adapter: './adapters/subtractSixAdapter.js'
  },
  subtract_seven: {
    name: 'Subtract Seven',
    folder: 'subtract_seven',
    testFile: './testCases/subtractSevenTests.js',
    adapter: './adapters/subtractSevenAdapter.js'
  },
  subtract_eight: {
    name: 'Subtract Eight',
    folder: 'subtract_eight',
    testFile: './testCases/subtractEightTests.js',
    adapter: './adapters/subtractEightAdapter.js'
  },
  subtract_nine: {
    name: 'Subtract Nine',
    folder: 'subtract_nine',
    testFile: './testCases/subtractNineTests.js',
    adapter: './adapters/subtractNineAdapter.js'
  },
  subtract_ten: {
    name: 'Subtract Ten',
    folder: 'subtract_ten',
    testFile: './testCases/subtractTenTests.js',
    adapter: './adapters/subtractTenAdapter.js'
  },
  multiply_by_six: {
    name: 'Multiply By Six',
    folder: 'multiply_by_six',
    testFile: './testCases/multiplyBySixTests.js',
    adapter: './adapters/multiplyBySixAdapter.js'
  },
  multiply_by_seven: {
    name: 'Multiply By Seven',
    folder: 'multiply_by_seven',
    testFile: './testCases/multiplyBySevenTests.js',
    adapter: './adapters/multiplyBySevenAdapter.js'
  },
  multiply_by_eight: {
    name: 'Multiply By Eight',
    folder: 'multiply_by_eight',
    testFile: './testCases/multiplyByEightTests.js',
    adapter: './adapters/multiplyByEightAdapter.js'
  },
  multiply_by_nine: {
    name: 'Multiply By Nine',
    folder: 'multiply_by_nine',
    testFile: './testCases/multiplyByNineTests.js',
    adapter: './adapters/multiplyByNineAdapter.js'
  },
  multiply_by_ten: {
    name: 'Multiply By Ten',
    folder: 'multiply_by_ten',
    testFile: './testCases/multiplyByTenTests.js',
    adapter: './adapters/multiplyByTenAdapter.js'
  },
  multiply_by_eleven: {
    name: 'Multiply By Eleven',
    folder: 'multiply_by_eleven',
    testFile: './testCases/multiplyByElevenTests.js',
    adapter: './adapters/multiplyByElevenAdapter.js'
  },
  multiply_by_twelve: {
    name: 'Multiply By Twelve',
    folder: 'multiply_by_twelve',
    testFile: './testCases/multiplyByTwelveTests.js',
    adapter: './adapters/multiplyByTwelveAdapter.js'
  },
  divide_by_two: {
    name: 'Divide By Two',
    folder: 'divide_by_two',
    testFile: './testCases/divideByTwoTests.js',
    adapter: './adapters/divideByTwoAdapter.js'
  },
  divide_by_three: {
    name: 'Divide By Three',
    folder: 'divide_by_three',
    testFile: './testCases/divideByThreeTests.js',
    adapter: './adapters/divideByThreeAdapter.js'
  },
  divide_by_four: {
    name: 'Divide By Four',
    folder: 'divide_by_four',
    testFile: './testCases/divideByFourTests.js',
    adapter: './adapters/divideByFourAdapter.js'
  },
  divide_by_five: {
    name: 'Divide By Five',
    folder: 'divide_by_five',
    testFile: './testCases/divideByFiveTests.js',
    adapter: './adapters/divideByFiveAdapter.js'
  },
  divide_by_six: {
    name: 'Divide By Six',
    folder: 'divide_by_six',
    testFile: './testCases/divideBySixTests.js',
    adapter: './adapters/divideBySixAdapter.js'
  },
  square_plus_two: {
    name: 'Square Plus Two',
    folder: 'square_plus_two',
    testFile: './testCases/squarePlusTwoTests.js',
    adapter: './adapters/squarePlusTwoAdapter.js'
  },
  square_plus_three: {
    name: 'Square Plus Three',
    folder: 'square_plus_three',
    testFile: './testCases/squarePlusThreeTests.js',
    adapter: './adapters/squarePlusThreeAdapter.js'
  },
  square_minus_two: {
    name: 'Square Minus Two',
    folder: 'square_minus_two',
    testFile: './testCases/squareMinusTwoTests.js',
    adapter: './adapters/squareMinusTwoAdapter.js'
  },
  square_minus_three: {
    name: 'Square Minus Three',
    folder: 'square_minus_three',
    testFile: './testCases/squareMinusThreeTests.js',
    adapter: './adapters/squareMinusThreeAdapter.js'
  },
  cube_plus_one: {
    name: 'Cube Plus One',
    folder: 'cube_plus_one',
    testFile: './testCases/cubePlusOneTests.js',
    adapter: './adapters/cubePlusOneAdapter.js'
  },
  cube_plus_two: {
    name: 'Cube Plus Two',
    folder: 'cube_plus_two',
    testFile: './testCases/cubePlusTwoTests.js',
    adapter: './adapters/cubePlusTwoAdapter.js'
  },
  clamp_to_ten: {
    name: 'Clamp To Ten',
    folder: 'clamp_to_ten',
    testFile: './testCases/clampToTenTests.js',
    adapter: './adapters/clampToTenAdapter.js'
  },
  clamp_to_fifty: {
    name: 'Clamp To Fifty',
    folder: 'clamp_to_fifty',
    testFile: './testCases/clampToFiftyTests.js',
    adapter: './adapters/clampToFiftyAdapter.js'
  },
  is_multiple_of_five: {
    name: 'Is Multiple Of Five',
    folder: 'is_multiple_of_five',
    testFile: './testCases/isMultipleOfFiveTests.js',
    adapter: './adapters/isMultipleOfFiveAdapter.js'
  },
  is_multiple_of_seven: {
    name: 'Is Multiple Of Seven',
    folder: 'is_multiple_of_seven',
    testFile: './testCases/isMultipleOfSevenTests.js',
    adapter: './adapters/isMultipleOfSevenAdapter.js'
  },
  is_multiple_of_nine: {
    name: 'Is Multiple Of Nine',
    folder: 'is_multiple_of_nine',
    testFile: './testCases/isMultipleOfNineTests.js',
    adapter: './adapters/isMultipleOfNineAdapter.js'
  },
  is_multiple_of_ten: {
    name: 'Is Multiple Of Ten',
    folder: 'is_multiple_of_ten',
    testFile: './testCases/isMultipleOfTenTests.js',
    adapter: './adapters/isMultipleOfTenAdapter.js'
  },
  ends_with_question_mark: {
    name: 'Ends With Question Mark',
    folder: 'ends_with_question_mark',
    testFile: './testCases/endsWithQuestionMarkTests.js',
    adapter: './adapters/endsWithQuestionMarkAdapter.js'
  },
  ends_with_period: {
    name: 'Ends With Period',
    folder: 'ends_with_period',
    testFile: './testCases/endsWithPeriodTests.js',
    adapter: './adapters/endsWithPeriodAdapter.js'
  },
  ends_with_comma: {
    name: 'Ends With Comma',
    folder: 'ends_with_comma',
    testFile: './testCases/endsWithCommaTests.js',
    adapter: './adapters/endsWithCommaAdapter.js'
  },
  starts_with_consonant: {
    name: 'Starts With Consonant',
    folder: 'starts_with_consonant',
    testFile: './testCases/startsWithConsonantTests.js',
    adapter: './adapters/startsWithConsonantAdapter.js'
  },
  starts_with_digit: {
    name: 'Starts With Digit',
    folder: 'starts_with_digit',
    testFile: './testCases/startsWithDigitTests.js',
    adapter: './adapters/startsWithDigitAdapter.js'
  },
  starts_with_lowercase: {
    name: 'Starts With Lowercase',
    folder: 'starts_with_lowercase',
    testFile: './testCases/startsWithLowercaseTests.js',
    adapter: './adapters/startsWithLowercaseAdapter.js'
  },
  contains_uppercase: {
    name: 'Contains Uppercase',
    folder: 'contains_uppercase',
    testFile: './testCases/containsUppercaseTests.js',
    adapter: './adapters/containsUppercaseAdapter.js'
  },
  contains_lowercase: {
    name: 'Contains Lowercase',
    folder: 'contains_lowercase',
    testFile: './testCases/containsLowercaseTests.js',
    adapter: './adapters/containsLowercaseAdapter.js'
  },
  count_digits_in_string: {
    name: 'Count Digits In String',
    folder: 'count_digits_in_string',
    testFile: './testCases/countDigitsInStringTests.js',
    adapter: './adapters/countDigitsInStringAdapter.js'
  },
  count_spaces: {
    name: 'Count Spaces',
    folder: 'count_spaces',
    testFile: './testCases/countSpacesTests.js',
    adapter: './adapters/countSpacesAdapter.js'
  },
  remove_consonants: {
    name: 'Remove Consonants',
    folder: 'remove_consonants',
    testFile: './testCases/removeConsonantsTests.js',
    adapter: './adapters/removeConsonantsAdapter.js'
  },
  replace_spaces_with_plus: {
    name: 'Replace Spaces With Plus',
    folder: 'replace_spaces_with_plus',
    testFile: './testCases/replaceSpacesWithPlusTests.js',
    adapter: './adapters/replaceSpacesWithPlusAdapter.js'
  },

  sum_of_digit_squares: {
    name: 'Sum of Digit Squares',
    folder: 'sum_of_digit_squares',
    testFile: './testCases/sumOfDigitSquaresTests.js',
    adapter: 'standard:sumOfDigitSquares:java'
  },
  rotate_string_k: {
    name: 'Rotate String K',
    folder: 'rotate_string_k',
    testFile: './testCases/rotateStringKTests.js',
    adapter: 'standard:rotateStringK:java'
  },
  first_non_repeating_char: {
    name: 'First Non-Repeating Char',
    folder: 'first_non_repeating_char',
    testFile: './testCases/firstNonRepeatingCharTests.js',
    adapter: 'standard:firstNonRepeatingChar:java'
  },
  is_power_of_three: {
    name: 'Is Power of Three',
    folder: 'is_power_of_three',
    testFile: './testCases/isPowerOfThreeTests.js',
    adapter: 'standard:isPowerOfThree:java'
  },
  count_set_bits: {
    name: 'Count Set Bits',
    folder: 'count_set_bits',
    testFile: './testCases/countSetBitsTests.js',
    adapter: 'standard:countSetBits:java'
  },
  reverse_words_in_string: {
    name: 'Reverse Words in String',
    folder: 'reverse_words_in_string',
    testFile: './testCases/reverseWordsInStringTests.js',
    adapter: 'standard:reverseWordsInString:java'
  },
  array_product_except_self: {
    name: 'Array Product Except Self',
    folder: 'array_product_except_self',
    testFile: './testCases/arrayProductExceptSelfTests.js',
    adapter: 'standard:arrayProductExceptSelf:java'
  },
  maximum_subarray_sum_k: {
    name: 'Maximum Subarray Sum K',
    folder: 'maximum_subarray_sum_k',
    testFile: './testCases/maximumSubarraySumKTests.js',
    adapter: 'standard:maximumSubarraySumK:java'
  },
  min_steps_to_zero: {
    name: 'Min Steps to Zero',
    folder: 'min_steps_to_zero',
    testFile: './testCases/minStepsToZeroTests.js',
    adapter: 'standard:minStepsToZero:java'
  },
  longest_run_of_ones: {
    name: 'Longest Run of Ones',
    folder: 'longest_run_of_ones',
    testFile: './testCases/longestRunOfOnesTests.js',
    adapter: 'standard:longestRunOfOnes:java'
  },
  valid_parentheses_with_star: {
    name: 'Valid Parentheses with Star',
    folder: 'valid_parentheses_with_star',
    testFile: './testCases/validParenthesesWithStarTests.js',
    adapter: 'standard:validParenthesesWithStar:java'
  },
  remove_adjacent_duplicates: {
    name: 'Remove Adjacent Duplicates',
    folder: 'remove_adjacent_duplicates',
    testFile: './testCases/removeAdjacentDuplicatesTests.js',
    adapter: 'standard:removeAdjacentDuplicates:java'
  },
  kth_smallest_in_bst: {
    name: 'Kth Smallest in BST',
    folder: 'kth_smallest_in_bst',
    testFile: './testCases/kthSmallestInBstTests.js',
    adapter: './adapters/kthSmallestInBstAdapter.js'
  },
  level_order_traversal: {
    name: 'Level Order Traversal',
    folder: 'level_order_traversal',
    testFile: './testCases/levelOrderTraversalTests.js',
    adapter: './adapters/levelOrderTraversalAdapter.js'
  },
  lowest_common_ancestor_bst: {
    name: 'Lowest Common Ancestor BST',
    folder: 'lowest_common_ancestor_bst',
    testFile: './testCases/lowestCommonAncestorBstTests.js',
    adapter: './adapters/lowestCommonAncestorBstAdapter.js'
  },
  merge_k_sorted_lists: {
    name: 'Merge K Sorted Lists',
    folder: 'merge_k_sorted_lists',
    testFile: './testCases/mergeKSortedListsTests.js',
    adapter: 'standard:mergeKSortedLists:java'
  },
  detect_cycle_in_linked_list: {
    name: 'Detect Cycle in Linked List',
    folder: 'detect_cycle_in_linked_list',
    testFile: './testCases/detectCycleInLinkedListTests.js',
    adapter: './adapters/detectCycleInLinkedListAdapter.js'
  },
  partition_equal_subset_sum: {
    name: 'Partition Equal Subset Sum',
    folder: 'partition_equal_subset_sum',
    testFile: './testCases/partitionEqualSubsetSumTests.js',
    adapter: 'standard:partitionEqualSubsetSum:java'
  },
  coin_change_min_coins: {
    name: 'Coin Change Min Coins',
    folder: 'coin_change_min_coins',
    testFile: './testCases/coinChangeMinCoinsTests.js',
    adapter: 'standard:coinChangeMinCoins:java'
  },
  longest_common_subsequence: {
    name: 'Longest Common Subsequence',
    folder: 'longest_common_subsequence',
    testFile: './testCases/longestCommonSubsequenceTests.js',
    adapter: 'standard:longestCommonSubsequence:java'
  },
  edit_distance: {
    name: 'Edit Distance',
    folder: 'edit_distance',
    testFile: './testCases/editDistanceTests.js',
    adapter: 'standard:editDistance:java'
  },
  unique_paths_with_obstacles: {
    name: 'Unique Paths with Obstacles',
    folder: 'unique_paths_with_obstacles',
    testFile: './testCases/uniquePathsWithObstaclesTests.js',
    adapter: 'standard:uniquePathsWithObstacles:java'
  },
  isomorphic_strings: {
    name: 'Isomorphic Strings',
    folder: 'isomorphic_strings',
    testFile: './testCases/isomorphicStringsTests.js',
    adapter: 'standard:isomorphicStrings:java'
  },
  find_peak_element: {
    name: 'Find Peak Element',
    folder: 'find_peak_element',
    testFile: './testCases/findPeakElementTests.js',
    adapter: 'standard:findPeakElement:java'
  },
  spiral_matrix_traversal: {
    name: 'Spiral Matrix Traversal',
    folder: 'spiral_matrix_traversal',
    testFile: './testCases/spiralMatrixTraversalTests.js',
    adapter: 'standard:spiralMatrixTraversal:java'
  },
  house_robber: {
    name: 'House Robber',
    folder: 'house_robber',
    testFile: './testCases/houseRobberTests.js',
    adapter: 'standard:houseRobber:java'
  },
  jump_game: {
    name: 'Jump Game',
    folder: 'jump_game',
    testFile: './testCases/jumpGameTests.js',
    adapter: 'standard:jumpGame:java'
  },
  search_insert_position: {
    name: 'Search Insert Position',
    folder: 'search_insert_position',
    testFile: './testCases/searchInsertPositionTests.js',
    adapter: 'standard:searchInsertPosition:java'
  },
  search_2d_matrix: {
    name: 'Search 2D Matrix',
    folder: 'search_2d_matrix',
    testFile: './testCases/search2dMatrixTests.js',
    adapter: 'standard:search2dMatrix:java'
  },
  merge_sorted_array: {
    name: 'Merge Sorted Array',
    folder: 'merge_sorted_array',
    testFile: './testCases/mergeSortedArrayTests.js',
    adapter: 'standard:mergeSortedArray:java'
  },
  plus_one: {
    name: 'Plus One',
    folder: 'plus_one',
    testFile: './testCases/plusOneTests.js',
    adapter: 'standard:plusOne:java'
  },
  add_strings: {
    name: 'Add Strings',
    folder: 'add_strings',
    testFile: './testCases/addStringsTests.js',
    adapter: 'standard:addStrings:java'
  },
  multiply_strings: {
    name: 'Multiply Strings',
    folder: 'multiply_strings',
    testFile: './testCases/multiplyStringsTests.js',
    adapter: 'standard:multiplyStrings:java'
  },
  roman_to_integer: {
    name: 'Roman To Integer',
    folder: 'roman_to_integer',
    testFile: './testCases/romanToIntegerTests.js',
    adapter: 'standard:romanToInteger:java'
  },
  integer_to_roman: {
    name: 'Integer To Roman',
    folder: 'integer_to_roman',
    testFile: './testCases/integerToRomanTests.js',
    adapter: 'standard:integerToRoman:java'
  },
  longest_palindromic_substring: {
    name: 'Longest Palindromic Substring',
    folder: 'longest_palindromic_substring',
    testFile: './testCases/longestPalindromicSubstringTests.js',
    adapter: 'standard:longestPalindromicSubstring:java'
  },
  palindrome_number: {
    name: 'Palindrome Number',
    folder: 'palindrome_number',
    testFile: './testCases/palindromeNumberTests.js',
    adapter: 'standard:palindromeNumber:java'
  },
  reverse_bits: {
    name: 'Reverse Bits',
    folder: 'reverse_bits',
    testFile: './testCases/reverseBitsTests.js',
    adapter: 'standard:reverseBits:java'
  },
  hamming_distance: {
    name: 'Hamming Distance',
    folder: 'hamming_distance',
    testFile: './testCases/hammingDistanceTests.js',
    adapter: 'standard:hammingDistance:java'
  },
  missing_number: {
    name: 'Missing Number',
    folder: 'missing_number',
    testFile: './testCases/missingNumberTests.js',
    adapter: 'standard:missingNumber:java'
  },
  find_pivot_index: {
    name: 'Find Pivot Index',
    folder: 'find_pivot_index',
    testFile: './testCases/findPivotIndexTests.js',
    adapter: 'standard:findPivotIndex:java'
  },
  range_sum_query_immutable: {
    name: 'Range Sum Query (Immutable)',
    folder: 'range_sum_query_immutable',
    testFile: './testCases/rangeSumQueryImmutableTests.js',
    adapter: 'standard:rangeSumQueryImmutable:java'
  },
  flood_fill: {
    name: 'Flood Fill',
    folder: 'flood_fill',
    testFile: './testCases/floodFillTests.js',
    adapter: 'standard:floodFill:java'
  },
  island_perimeter: {
    name: 'Island Perimeter',
    folder: 'island_perimeter',
    testFile: './testCases/islandPerimeterTests.js',
    adapter: 'standard:islandPerimeter:java'
  },
  min_stack: {
    name: 'Min Stack',
    folder: 'min_stack',
    testFile: './testCases/minStackTests.js',
    adapter: 'standard:minStack:java'
  },
  max_depth_of_binary_tree: {
    name: 'Max Depth Of Binary Tree',
    folder: 'max_depth_of_binary_tree',
    testFile: './testCases/maxDepthOfBinaryTreeTests.js',
    adapter: './adapters/maxDepthOfBinaryTreeAdapter.js'
  },
  diameter_of_binary_tree: {
    name: 'Diameter Of Binary Tree',
    folder: 'diameter_of_binary_tree',
    testFile: './testCases/diameterOfBinaryTreeTests.js',
    adapter: './adapters/diameterOfBinaryTreeAdapter.js'
  },
  balanced_binary_tree: {
    name: 'Balanced Binary Tree',
    folder: 'balanced_binary_tree',
    testFile: './testCases/balancedBinaryTreeTests.js',
    adapter: './adapters/balancedBinaryTreeAdapter.js'
  },
  lowest_common_ancestor_binary_tree: {
    name: 'Lowest Common Ancestor (Binary Tree)',
    folder: 'lowest_common_ancestor_binary_tree',
    testFile: './testCases/lowestCommonAncestorBinaryTreeTests.js',
    adapter: './adapters/lowestCommonAncestorBinaryTreeAdapter.js'
  },
  binary_tree_inorder_traversal: {
    name: 'Binary Tree Inorder Traversal',
    folder: 'binary_tree_inorder_traversal',
    testFile: './testCases/binaryTreeInorderTraversalTests.js',
    adapter: './adapters/binaryTreeInorderTraversalAdapter.js'
  },
  implement_trie: {
    name: 'Implement Trie',
    folder: 'implement_trie',
    testFile: './testCases/implementTrieTests.js',
    adapter: 'standard:implementTrie:java'
  },
  add_and_search_word: {
    name: 'Add and Search Word',
    folder: 'add_and_search_word',
    testFile: './testCases/addAndSearchWordTests.js',
    adapter: 'standard:addAndSearchWord:java'
  },
  replace_words: {
    name: 'Replace Words',
    folder: 'replace_words',
    testFile: './testCases/replaceWordsTests.js',
    adapter: 'standard:replaceWords:java'
  },
  word_search_ii: {
    name: 'Word Search II',
    folder: 'word_search_ii',
    testFile: './testCases/wordSearchIiTests.js',
    adapter: 'standard:wordSearchIi:java'
  },
  prefix_and_suffix_search: {
    name: 'Prefix and Suffix Search',
    folder: 'prefix_and_suffix_search',
    testFile: './testCases/prefixAndSuffixSearchTests.js',
    adapter: 'standard:prefixAndSuffixSearch:java'
  },
  search_suggestions_system: {
    name: 'Search Suggestions System',
    folder: 'search_suggestions_system',
    testFile: './testCases/searchSuggestionsSystemTests.js',
    adapter: 'standard:searchSuggestionsSystem:java'
  },
  map_sum_pairs: {
    name: 'Map Sum Pairs',
    folder: 'map_sum_pairs',
    testFile: './testCases/mapSumPairsTests.js',
    adapter: 'standard:mapSumPairs:java'
  },
  longest_word_in_dictionary: {
    name: 'Longest Word in Dictionary',
    folder: 'longest_word_in_dictionary',
    testFile: './testCases/longestWordInDictionaryTests.js',
    adapter: 'standard:longestWordInDictionary:java'
  },
  stream_of_characters: {
    name: 'Stream of Characters',
    folder: 'stream_of_characters',
    testFile: './testCases/streamOfCharactersTests.js',
    adapter: 'standard:streamOfCharacters:java'
  },
  maximum_xor_of_two_numbers: {
    name: 'Maximum XOR of Two Numbers',
    folder: 'maximum_xor_of_two_numbers',
    testFile: './testCases/maximumXorOfTwoNumbersTests.js',
    adapter: 'standard:maximumXorOfTwoNumbers:java'
  },
  accounts_merge: {
    name: 'Accounts Merge',
    folder: 'accounts_merge',
    testFile: './testCases/accountsMergeTests.js',
    adapter: 'standard:accountsMerge:java'
  },
  redundant_connection: {
    name: 'Redundant Connection',
    folder: 'redundant_connection',
    testFile: './testCases/redundantConnectionTests.js',
    adapter: 'standard:redundantConnection:java'
  },
  number_of_provinces: {
    name: 'Number of Provinces',
    folder: 'number_of_provinces',
    testFile: './testCases/numberOfProvincesTests.js',
    adapter: 'standard:numberOfProvinces:java'
  },
  satisfiability_of_equality_equations: {
    name: 'Satisfiability of Equality Equations',
    folder: 'satisfiability_of_equality_equations',
    testFile: './testCases/satisfiabilityOfEqualityEquationsTests.js',
    adapter: 'standard:satisfiabilityOfEqualityEquations:java'
  },
  lexicographically_smallest_equivalent_string: {
    name: 'Lexicographically Smallest Equivalent String',
    folder: 'lexicographically_smallest_equivalent_string',
    testFile: './testCases/lexicographicallySmallestEquivalentStringTests.js',
    adapter: 'standard:lexicographicallySmallestEquivalentString:java'
  },
  smallest_string_with_swaps: {
    name: 'Smallest String With Swaps',
    folder: 'smallest_string_with_swaps',
    testFile: './testCases/smallestStringWithSwapsTests.js',
    adapter: 'standard:smallestStringWithSwaps:java'
  },
  most_stones_removed: {
    name: 'Most Stones Removed',
    folder: 'most_stones_removed',
    testFile: './testCases/mostStonesRemovedTests.js',
    adapter: 'standard:mostStonesRemoved:java'
  },
  regions_cut_by_slashes: {
    name: 'Regions Cut By Slashes',
    folder: 'regions_cut_by_slashes',
    testFile: './testCases/regionsCutBySlashesTests.js',
    adapter: 'standard:regionsCutBySlashes:java'
  },
  daily_temperatures: {
    name: 'Daily Temperatures',
    folder: 'daily_temperatures',
    testFile: './testCases/dailyTemperaturesTests.js',
    adapter: 'standard:dailyTemperatures:java'
  },
  next_greater_element_i: {
    name: 'Next Greater Element I',
    folder: 'next_greater_element_i',
    testFile: './testCases/nextGreaterElementITests.js',
    adapter: 'standard:nextGreaterElementI:java'
  },
  next_greater_element_ii: {
    name: 'Next Greater Element II',
    folder: 'next_greater_element_ii',
    testFile: './testCases/nextGreaterElementIiTests.js',
    adapter: 'standard:nextGreaterElementIi:java'
  },
  largest_rectangle_in_histogram: {
    name: 'Largest Rectangle in Histogram',
    folder: 'largest_rectangle_in_histogram',
    testFile: './testCases/largestRectangleInHistogramTests.js',
    adapter: 'standard:largestRectangleInHistogram:java'
  },
  sum_of_subarray_minimums: {
    name: 'Sum of Subarray Minimums',
    folder: 'sum_of_subarray_minimums',
    testFile: './testCases/sumOfSubarrayMinimumsTests.js',
    adapter: 'standard:sumOfSubarrayMinimums:java'
  },
  shortest_unsorted_continuous_subarray: {
    name: 'Shortest Unsorted Continuous Subarray',
    folder: 'shortest_unsorted_continuous_subarray',
    testFile: './testCases/shortestUnsortedContinuousSubarrayTests.js',
    adapter: 'standard:shortestUnsortedContinuousSubarray:java'
  },
  maximum_width_ramp: {
    name: 'Maximum Width Ramp',
    folder: 'maximum_width_ramp',
    testFile: './testCases/maximumWidthRampTests.js',
    adapter: 'standard:maximumWidthRamp:java'
  },
  subarray_sum_equals_k: {
    name: 'Subarray Sum Equals K',
    folder: 'subarray_sum_equals_k',
    testFile: './testCases/subarraySumEqualsKTests.js',
    adapter: 'standard:subarraySumEqualsK:java'
  },
  contiguous_array: {
    name: 'Contiguous Array',
    folder: 'contiguous_array',
    testFile: './testCases/contiguousArrayTests.js',
    adapter: 'standard:contiguousArray:java'
  },
  minimum_path_sum: {
    name: 'Minimum Path Sum',
    folder: 'minimum_path_sum',
    testFile: './testCases/minimumPathSumTests.js',
    adapter: 'standard:minimumPathSum:java'
  },
  unique_paths: {
    name: 'Unique Paths',
    folder: 'unique_paths',
    testFile: './testCases/uniquePathsTests.js',
    adapter: 'standard:uniquePaths:java'
  },
  decode_ways: {
    name: 'Decode Ways',
    folder: 'decode_ways',
    testFile: './testCases/decodeWaysTests.js',
    adapter: 'standard:decodeWays:java'
  },
  word_break: {
    name: 'Word Break',
    folder: 'word_break',
    testFile: './testCases/wordBreakTests.js',
    adapter: 'standard:wordBreak:java'
  },
  longest_increasing_subsequence: {
    name: 'Longest Increasing Subsequence',
    folder: 'longest_increasing_subsequence',
    testFile: './testCases/longestIncreasingSubsequenceTests.js',
    adapter: 'standard:longestIncreasingSubsequence:java'
  },
  spiral_matrix_ii: {
    name: 'Spiral Matrix II',
    folder: 'spiral_matrix_ii',
    testFile: './testCases/spiralMatrixIiTests.js',
    adapter: 'standard:spiralMatrixIi:java'
  },
  search_2d_matrix_ii: {
    name: 'Search 2D Matrix II',
    folder: 'search_2d_matrix_ii',
    testFile: './testCases/search2dMatrixIiTests.js',
    adapter: 'standard:search2dMatrixIi:java'
  },
  find_duplicate_number: {
    name: 'Find Duplicate Number',
    folder: 'find_duplicate_number',
    testFile: './testCases/findDuplicateNumberTests.js',
    adapter: 'standard:findDuplicateNumber:java'
  },
  minimum_size_subarray_sum: {
    name: 'Minimum Size Subarray Sum',
    folder: 'minimum_size_subarray_sum',
    testFile: './testCases/minimumSizeSubarraySumTests.js',
    adapter: 'standard:minimumSizeSubarraySum:java'
  },
  partition_labels: {
    name: 'Partition Labels',
    folder: 'partition_labels',
    testFile: './testCases/partitionLabelsTests.js',
    adapter: 'standard:partitionLabels:java'
  },
  next_permutation: {
    name: 'Next Permutation',
    folder: 'next_permutation',
    testFile: './testCases/nextPermutationTests.js',
    adapter: 'standard:nextPermutation:java'
  },
  k_closest_points_to_origin: {
    name: 'K Closest Points to Origin',
    folder: 'k_closest_points_to_origin',
    testFile: './testCases/kClosestPointsToOriginTests.js',
    adapter: 'standard:kClosestPointsToOrigin:java'
  },
  interval_list_intersections: {
    name: 'Interval List Intersections',
    folder: 'interval_list_intersections',
    testFile: './testCases/intervalListIntersectionsTests.js',
    adapter: 'standard:intervalListIntersections:java'
  },
  combination_sum_iii: {
    name: 'Combination Sum III',
    folder: 'combination_sum_iii',
    testFile: './testCases/combinationSumIiiTests.js',
    adapter: 'standard:combinationSumIii:java'
  },
  sort_colors: {
    name: 'Sort Colors',
    folder: 'sort_colors',
    testFile: './testCases/sortColorsTests.js',
    adapter: 'standard:sortColors:java'
  },
  kth_smallest_in_sorted_matrix: {
    name: 'Kth Smallest in Sorted Matrix',
    folder: 'kth_smallest_in_sorted_matrix',
    testFile: './testCases/kthSmallestInSortedMatrixTests.js',
    adapter: 'standard:kthSmallestInSortedMatrix:java'
  },
  shortest_path_in_binary_matrix: {
    name: 'Shortest Path in Binary Matrix',
    folder: 'shortest_path_in_binary_matrix',
    testFile: './testCases/shortestPathInBinaryMatrixTests.js',
    adapter: 'standard:shortestPathInBinaryMatrix:java'
  },
  decode_string: {
    name: 'Decode String',
    folder: 'decode_string',
    testFile: './testCases/decodeStringTests.js',
    adapter: 'standard:decodeString:java'
  },
  evaluate_reverse_polish_notation: {
    name: 'Evaluate Reverse Polish Notation',
    folder: 'evaluate_reverse_polish_notation',
    testFile: './testCases/evaluateReversePolishNotationTests.js',
    adapter: 'standard:evaluateReversePolishNotation:java'
  },
  asteroid_collision: {
    name: 'Asteroid Collision',
    folder: 'asteroid_collision',
    testFile: './testCases/asteroidCollisionTests.js',
    adapter: 'standard:asteroidCollision:java'
  },
  find_all_anagrams_in_a_string: {
    name: 'Find All Anagrams in a String',
    folder: 'find_all_anagrams_in_a_string',
    testFile: './testCases/findAllAnagramsInAStringTests.js',
    adapter: 'standard:findAllAnagramsInAString:java'
  },
  subarray_product_less_than_k: {
    name: 'Subarray Product Less Than K',
    folder: 'subarray_product_less_than_k',
    testFile: './testCases/subarrayProductLessThanKTests.js',
    adapter: 'standard:subarrayProductLessThanK:java'
  },
  maximal_square: {
    name: 'Maximal Square',
    folder: 'maximal_square',
    testFile: './testCases/maximalSquareTests.js',
    adapter: 'standard:maximalSquare:java'
  },

  max_product_subarray: {
    name: 'Max Product Subarray',
    folder: 'max_product_subarray',
    testFile: './testCases/maxProductSubarrayTests.js',
    adapter: 'standard:maxProductSubarray:java'
  },
  longest_subarray_sum_equals_k: {
    name: 'Longest Subarray Sum Equals K',
    folder: 'longest_subarray_sum_equals_k',
    testFile: './testCases/longestSubarraySumEqualsKTests.js',
    adapter: 'standard:longestSubarraySumEqualsK:java'
  },
  subarray_sum_divisible_by_k: {
    name: 'Subarray Sum Divisible by K',
    folder: 'subarray_sum_divisible_by_k',
    testFile: './testCases/subarraySumDivisibleByKTests.js',
    adapter: 'standard:subarraySumDivisibleByK:java'
  },
  max_consecutive_ones_with_k_flips: {
    name: 'Max Consecutive Ones with K Flips',
    folder: 'max_consecutive_ones_with_k_flips',
    testFile: './testCases/maxConsecutiveOnesWithKFlipsTests.js',
    adapter: 'standard:maxConsecutiveOnesWithKFlips:java'
  },
  rotate_array_by_k: {
    name: 'Rotate Array by K',
    folder: 'rotate_array_by_k',
    testFile: './testCases/rotateArrayByKTests.js',
    adapter: 'standard:rotateArrayByK:java'
  },
  minimum_swaps_to_group_ones: {
    name: 'Minimum Swaps to Group Ones',
    folder: 'minimum_swaps_to_group_ones',
    testFile: './testCases/minimumSwapsToGroupOnesTests.js',
    adapter: 'standard:minimumSwapsToGroupOnes:java'
  },
  longest_mountain_in_array: {
    name: 'Longest Mountain in Array',
    folder: 'longest_mountain_in_array',
    testFile: './testCases/longestMountainInArrayTests.js',
    adapter: 'standard:longestMountainInArray:java'
  },
  kth_missing_positive_number: {
    name: 'Kth Missing Positive Number',
    folder: 'kth_missing_positive_number',
    testFile: './testCases/kthMissingPositiveNumberTests.js',
    adapter: 'standard:kthMissingPositiveNumber:java'
  },
  max_sum_of_min_pairs: {
    name: 'Max Sum of Min Pairs',
    folder: 'max_sum_of_min_pairs',
    testFile: './testCases/maxSumOfMinPairsTests.js',
    adapter: 'standard:maxSumOfMinPairs:java'
  },
  remove_duplicates_allow_two: {
    name: 'Remove Duplicates Allow Two',
    folder: 'remove_duplicates_allow_two',
    testFile: './testCases/removeDuplicatesAllowTwoTests.js',
    adapter: 'standard:removeDuplicatesAllowTwo:java'
  },
  count_subarrays_with_even_sum: {
    name: 'Count Subarrays with Even Sum',
    folder: 'count_subarrays_with_even_sum',
    testFile: './testCases/countSubarraysWithEvenSumTests.js',
    adapter: 'standard:countSubarraysWithEvenSum:java'
  },
  longest_subarray_at_most_k_distinct: {
    name: 'Longest Subarray with At Most K Distinct',
    folder: 'longest_subarray_at_most_k_distinct',
    testFile: './testCases/longestSubarrayAtMostKDistinctTests.js',
    adapter: 'standard:longestSubarrayAtMostKDistinct:java'
  },
  minimum_remove_to_make_valid_parentheses: {
    name: 'Minimum Remove to Make Valid Parentheses',
    folder: 'minimum_remove_to_make_valid_parentheses',
    testFile: './testCases/minimumRemoveToMakeValidParenthesesTests.js',
    adapter: 'standard:minimumRemoveToMakeValidParentheses:java'
  },
  remove_adjacent_k_duplicates: {
    name: 'Remove Adjacent K Duplicates',
    folder: 'remove_adjacent_k_duplicates',
    testFile: './testCases/removeAdjacentKDuplicatesTests.js',
    adapter: 'standard:removeAdjacentKDuplicates:java'
  },
  one_edit_distance: {
    name: 'One Edit Distance',
    folder: 'one_edit_distance',
    testFile: './testCases/oneEditDistanceTests.js',
    adapter: 'standard:oneEditDistance:java'
  },
  longest_palindrome_length: {
    name: 'Longest Palindrome Length',
    folder: 'longest_palindrome_length',
    testFile: './testCases/longestPalindromeLengthTests.js',
    adapter: 'standard:longestPalindromeLength:java'
  },
  longest_substring_k_distinct: {
    name: 'Longest Substring with K Distinct',
    folder: 'longest_substring_k_distinct',
    testFile: './testCases/longestSubstringKDistinctTests.js',
    adapter: 'standard:longestSubstringKDistinct:java'
  },
  count_palindromic_substrings: {
    name: 'Count Palindromic Substrings',
    folder: 'count_palindromic_substrings',
    testFile: './testCases/countPalindromicSubstringsTests.js',
    adapter: 'standard:countPalindromicSubstrings:java'
  },
  string_run_length_encode: {
    name: 'Run Length Encode String',
    folder: 'string_run_length_encode',
    testFile: './testCases/stringRunLengthEncodeTests.js',
    adapter: 'standard:stringRunLengthEncode:java'
  },
  simplify_path: {
    name: 'Simplify Path',
    folder: 'simplify_path',
    testFile: './testCases/simplifyPathTests.js',
    adapter: 'standard:simplifyPath:java'
  },
  matrix_block_sum: {
    name: 'Matrix Block Sum',
    folder: 'matrix_block_sum',
    testFile: './testCases/matrixBlockSumTests.js',
    adapter: 'standard:matrixBlockSum:java'
  },
  diagonal_traverse: {
    name: 'Diagonal Traverse',
    folder: 'diagonal_traverse',
    testFile: './testCases/diagonalTraverseTests.js',
    adapter: 'standard:diagonalTraverse:java'
  },
  max_area_of_island: {
    name: 'Max Area of Island',
    folder: 'max_area_of_island',
    testFile: './testCases/maxAreaOfIslandTests.js',
    adapter: 'standard:maxAreaOfIsland:java'
  },
  number_of_closed_islands: {
    name: 'Number of Closed Islands',
    folder: 'number_of_closed_islands',
    testFile: './testCases/numberOfClosedIslandsTests.js',
    adapter: 'standard:numberOfClosedIslands:java'
  },
  count_battleships: {
    name: 'Count Battleships',
    folder: 'count_battleships',
    testFile: './testCases/countBattleshipsTests.js',
    adapter: 'standard:countBattleships:java'
  },
  longest_consecutive_sequence: {
    name: 'Longest Consecutive Sequence',
    folder: 'longest_consecutive_sequence',
    testFile: './testCases/longestConsecutiveSequenceTests.js',
    adapter: 'standard:longestConsecutiveSequence:java'
  },
  min_increment_to_make_array_unique: {
    name: 'Min Increment to Make Array Unique',
    folder: 'min_increment_to_make_array_unique',
    testFile: './testCases/minIncrementToMakeArrayUniqueTests.js',
    adapter: 'standard:minIncrementToMakeArrayUnique:java'
  },
  check_subarray_sum_multiple_of_k: {
    name: 'Check Subarray Sum Multiple of K',
    folder: 'check_subarray_sum_multiple_of_k',
    testFile: './testCases/checkSubarraySumMultipleOfKTests.js',
    adapter: 'standard:checkSubarraySumMultipleOfK:java'
  },
  maximum_sum_circular_subarray: {
    name: 'Maximum Sum Circular Subarray',
    folder: 'maximum_sum_circular_subarray',
    testFile: './testCases/maximumSumCircularSubarrayTests.js',
    adapter: 'standard:maximumSumCircularSubarray:java'
  },
  min_cost_climbing_stairs: {
    name: 'Min Cost Climbing Stairs',
    folder: 'min_cost_climbing_stairs',
    testFile: './testCases/minCostClimbingStairsTests.js',
    adapter: 'standard:minCostClimbingStairs:java'
  },
  find_k_closest_elements: {
    name: 'Find K Closest Elements',
    folder: 'find_k_closest_elements',
    testFile: './testCases/findKClosestElementsTests.js',
    adapter: 'standard:findKClosestElements:java'
  },
  k_diff_pairs_in_array: {
    name: 'K-diff Pairs in Array',
    folder: 'k_diff_pairs_in_array',
    testFile: './testCases/kDiffPairsInArrayTests.js',
    adapter: 'standard:kDiffPairsInArray:java'
  },
  minimum_time_difference: {
    name: 'Minimum Time Difference',
    folder: 'minimum_time_difference',
    testFile: './testCases/minimumTimeDifferenceTests.js',
    adapter: 'standard:minimumTimeDifference:java'
  },
  reorganize_string: {
    name: 'Reorganize String',
    folder: 'reorganize_string',
    testFile: './testCases/reorganizeStringTests.js',
    adapter: 'standard:reorganizeString:java'
  },
  remove_k_digits: {
    name: 'Remove K Digits',
    folder: 'remove_k_digits',
    testFile: './testCases/removeKDigitsTests.js',
    adapter: 'standard:removeKDigits:java'
  },
  smallest_subsequence_of_distinct_chars: {
    name: 'Smallest Subsequence of Distinct Characters',
    folder: 'smallest_subsequence_of_distinct_chars',
    testFile: './testCases/smallestSubsequenceOfDistinctCharsTests.js',
    adapter: 'standard:smallestSubsequenceOfDistinctChars:java'
  },
  longest_common_substring: {
    name: 'Longest Common Substring',
    folder: 'longest_common_substring',
    testFile: './testCases/longestCommonSubstringTests.js',
    adapter: 'standard:longestCommonSubstring:java'
  },
  group_shifted_strings: {
    name: 'Group Shifted Strings',
    folder: 'group_shifted_strings',
    testFile: './testCases/groupShiftedStringsTests.js',
    adapter: 'standard:groupShiftedStrings:java'
  },
  validate_ip_address: {
    name: 'Validate IP Address',
    folder: 'validate_ip_address',
    testFile: './testCases/validateIpAddressTests.js',
    adapter: 'standard:validateIPAddress:java'
  },
  minimum_deletions_to_make_string_balanced: {
    name: 'Minimum Deletions to Make String Balanced',
    folder: 'minimum_deletions_to_make_string_balanced',
    testFile: './testCases/minimumDeletionsToMakeStringBalancedTests.js',
    adapter: 'standard:minimumDeletionsToMakeStringBalanced:java'
  },
  maximal_rectangle: {
    name: 'Maximal Rectangle',
    folder: 'maximal_rectangle',
    testFile: './testCases/maximalRectangleTests.js',
    adapter: 'standard:maximalRectangle:java'
  },
  minimum_falling_path_sum: {
    name: 'Minimum Falling Path Sum',
    folder: 'minimum_falling_path_sum',
    testFile: './testCases/minimumFallingPathSumTests.js',
    adapter: 'standard:minimumFallingPathSum:java'
  },
  number_of_enclaves: {
    name: 'Number of Enclaves',
    folder: 'number_of_enclaves',
    testFile: './testCases/numberOfEnclavesTests.js',
    adapter: 'standard:numberOfEnclaves:java'
  },
  count_sub_islands: {
    name: 'Count Sub Islands',
    folder: 'count_sub_islands',
    testFile: './testCases/countSubIslandsTests.js',
    adapter: 'standard:countSubIslands:java'
  },
  shortest_bridge: {
    name: 'Shortest Bridge',
    folder: 'shortest_bridge',
    testFile: './testCases/shortestBridgeTests.js',
    adapter: 'standard:shortestBridge:java'
  },
  equal_row_and_column_pairs: {
    name: 'Equal Row and Column Pairs',
    folder: 'equal_row_and_column_pairs',
    testFile: './testCases/equalRowAndColumnPairsTests.js',
    adapter: 'standard:equalRowAndColumnPairs:java'
  },
  longest_turbulent_subarray: {
    name: 'Longest Turbulent Subarray',
    folder: 'longest_turbulent_subarray',
    testFile: './testCases/longestTurbulentSubarrayTests.js',
    adapter: 'standard:longestTurbulentSubarray:java'
  },
  max_chunks_to_make_sorted: {
    name: 'Max Chunks to Make Sorted',
    folder: 'max_chunks_to_make_sorted',
    testFile: './testCases/maxChunksToMakeSortedTests.js',
    adapter: 'standard:maxChunksToMakeSorted:java'
  },
  subarray_bitwise_ors: {
    name: 'Subarray Bitwise ORs',
    folder: 'subarray_bitwise_ors',
    testFile: './testCases/subarrayBitwiseOrsTests.js',
    adapter: 'standard:subarrayBitwiseORs:java'
  },
  peak_index_in_mountain_array: {
    name: 'Peak Index in Mountain Array',
    folder: 'peak_index_in_mountain_array',
    testFile: './testCases/peakIndexInMountainArrayTests.js',
    adapter: 'standard:peakIndexInMountainArray:java'
  },
  word_ladder_length: {
    name: 'Word Ladder Length',
    folder: 'word_ladder_length',
    testFile: './testCases/wordLadderLengthTests.js',
    adapter: 'standard:wordLadderLength:java'
  },
  open_the_lock: {
    name: 'Open the Lock',
    folder: 'open_the_lock',
    testFile: './testCases/openTheLockTests.js',
    adapter: 'standard:openTheLock:java'
  },
  nearest_exit_in_maze: {
    name: 'Nearest Exit in Maze',
    folder: 'nearest_exit_in_maze',
    testFile: './testCases/nearestExitInMazeTests.js',
    adapter: 'standard:nearestExitInMaze:java'
  },
  walls_and_gates: {
    name: 'Walls and Gates',
    folder: 'walls_and_gates',
    testFile: './testCases/wallsAndGatesTests.js',
    adapter: 'standard:wallsAndGates:java'
  },
  zero_one_matrix: {
    name: 'Zero One Matrix',
    folder: 'zero_one_matrix',
    testFile: './testCases/zeroOneMatrixTests.js',
    adapter: 'standard:zeroOneMatrix:java'
  },
  shortest_path_to_food: {
    name: 'Shortest Path to Food',
    folder: 'shortest_path_to_food',
    testFile: './testCases/shortestPathToFoodTests.js',
    adapter: 'standard:shortestPathToFood:java'
  },
  minimum_knight_moves: {
    name: 'Minimum Knight Moves',
    folder: 'minimum_knight_moves',
    testFile: './testCases/minimumKnightMovesTests.js',
    adapter: 'standard:minimumKnightMoves:java'
  },
  minimum_genetic_mutation: {
    name: 'Minimum Genetic Mutation',
    folder: 'minimum_genetic_mutation',
    testFile: './testCases/minimumGeneticMutationTests.js',
    adapter: 'standard:minimumGeneticMutation:java'
  },
  shortest_path_unweighted_graph: {
    name: 'Shortest Path in Unweighted Graph',
    folder: 'shortest_path_unweighted_graph',
    testFile: './testCases/shortestPathUnweightedGraphTests.js',
    adapter: 'standard:shortestPathUnweightedGraph:java'
  },
  shortest_path_with_obstacles_elimination: {
    name: 'Shortest Path With Obstacles Elimination',
    folder: 'shortest_path_with_obstacles_elimination',
    testFile: './testCases/shortestPathWithObstaclesEliminationTests.js',
    adapter: 'standard:shortestPathWithObstaclesElimination:java'
  },
  min_steps_to_reach_target: {
    name: 'Min Steps to Reach Target',
    folder: 'min_steps_to_reach_target',
    testFile: './testCases/minStepsToReachTargetTests.js',
    adapter: 'standard:minStepsToReachTarget:java'
  },
  jump_game_iv_min_jumps: {
    name: 'Jump Game IV Min Jumps',
    folder: 'jump_game_iv_min_jumps',
    testFile: './testCases/jumpGameIvMinJumpsTests.js',
    adapter: 'standard:jumpGameIvMinJumps:java'
  },
  bus_routes_min_buses: {
    name: 'Bus Routes Min Buses',
    folder: 'bus_routes_min_buses',
    testFile: './testCases/busRoutesMinBusesTests.js',
    adapter: 'standard:busRoutesMinBuses:java'
  },
  rolling_ball_maze_shortest_path: {
    name: 'Rolling Ball Maze Shortest Path',
    folder: 'rolling_ball_maze_shortest_path',
    testFile: './testCases/rollingBallMazeShortestPathTests.js',
    adapter: 'standard:rollingBallMazeShortestPath:java'
  },
  shortest_path_in_binary_matrix_4dir: {
    name: 'Shortest Path in Binary Matrix (4 Directions)',
    folder: 'shortest_path_in_binary_matrix_4dir',
    testFile: './testCases/shortestPathInBinaryMatrix4DirTests.js',
    adapter: 'standard:shortestPathInBinaryMatrix4Dir:java'
  },
  shortest_path_collect_all_keys: {
    name: 'Shortest Path to Collect All Keys',
    folder: 'shortest_path_collect_all_keys',
    testFile: './testCases/shortestPathCollectAllKeysTests.js',
    adapter: 'standard:shortestPathCollectAllKeys:java'
  },
  max_distance_from_land: {
    name: 'Max Distance From Land',
    folder: 'max_distance_from_land',
    testFile: './testCases/maxDistanceFromLandTests.js',
    adapter: 'standard:maxDistanceFromLand:java'
  },
  shortest_path_with_portals: {
    name: 'Shortest Path With Portals',
    folder: 'shortest_path_with_portals',
    testFile: './testCases/shortestPathWithPortalsTests.js',
    adapter: 'standard:shortestPathWithPortals:java'
  },
  word_ladder_paths_count: {
    name: 'Word Ladder Paths Count',
    folder: 'word_ladder_paths_count',
    testFile: './testCases/wordLadderPathsCountTests.js',
    adapter: 'standard:wordLadderPathsCount:java'
  },
  word_graph_distances: {
    name: 'Word Graph Distances',
    folder: 'word_graph_distances',
    testFile: './testCases/wordGraphDistancesTests.js',
    adapter: 'standard:wordGraphDistances:java'
  },
  graph_distances_from_source: {
    name: 'Graph Distances From Source',
    folder: 'graph_distances_from_source',
    testFile: './testCases/graphDistancesFromSourceTests.js',
    adapter: 'standard:graphDistancesFromSource:java'
  },
  is_graph_bipartite_matrix: {
    name: 'Is Graph Bipartite',
    folder: 'is_graph_bipartite_matrix',
    testFile: './testCases/isGraphBipartiteMatrixTests.js',
    adapter: 'standard:isGraphBipartiteMatrix:java'
  },
  count_connected_components: {
    name: 'Count Connected Components',
    folder: 'count_connected_components',
    testFile: './testCases/countConnectedComponentsTests.js',
    adapter: 'standard:countConnectedComponents:java'
  },
  nodes_at_distance_k: {
    name: 'Nodes at Distance K',
    folder: 'nodes_at_distance_k',
    testFile: './testCases/nodesAtDistanceKTests.js',
    adapter: 'standard:nodesAtDistanceK:java'
  },
  jump_game_iii_min_steps: {
    name: 'Jump Game III Min Steps',
    folder: 'jump_game_iii_min_steps',
    testFile: './testCases/jumpGameIiiMinStepsTests.js',
    adapter: 'standard:jumpGameIiiMinSteps:java'
  },

};

const STANDARD_ADAPTER_OVERRIDES = new Set([
  'groupAnagrams',
  'threeSum',
  'topKFrequentElements'
]);

// Helper function to get challenge config
// Tries database first, falls back to CHALLENGES object
function getChallenge(challengeId) {
  // Try database first
  try {
    const dbChallenge = getChallengeById(challengeId);
    if (dbChallenge) {
      // Convert database format to expected format
      const candidate = {
        name: dbChallenge.name,
        folder: dbChallenge.folder,
        testFile: dbChallenge.test_file,
        adapter: dbChallenge.adapter
      };
      const testFilePath = candidate.testFile ? join(__dirname, candidate.testFile) : null;
      const adapterPath = candidate.adapter ? join(__dirname, candidate.adapter) : null;
      const hasFileTests = testFilePath ? existsSync(testFilePath) : false;
      const hasFileAdapter = adapterPath ? existsSync(adapterPath) : false;
      const hasStandardAdapter = candidate.adapter?.startsWith('standard:')
        || candidate.adapter?.startsWith('db-standard:')
        || Boolean(getStandardAdapterKeyFromPath(candidate.adapter));
      const hasDbAdapter = Boolean(getChallengeAdapterDefinition(challengeId));
      const hasDbTests = getChallengeTestCases(challengeId, 'run').length > 0
        || getChallengeTestCases(challengeId, 'submit').length > 0;

      if ((hasFileTests || hasDbTests) && (hasFileAdapter || hasDbAdapter || hasStandardAdapter)) {
        return candidate;
      }
    }
  } catch (error) {
    // Database might not be initialized or challenge not found
  }
  
  // Fallback to CHALLENGES object
  const challenge = CHALLENGES[challengeId];
  if (!challenge) {
    throw new Error(`Unknown challenge: ${challengeId}`);
  }
  return challenge;
}

function getStandardAdapterKeyFromPath(adapterPath) {
  if (!adapterPath || typeof adapterPath !== 'string') {
    return null;
  }
  const match = adapterPath.match(/\.\/adapters\/(?:(?:javascript|python|typescript)\/)?([A-Za-z0-9_]+)Adapter\.js$/);
  if (!match) {
    return null;
  }
  const key = match[1];
  if (!standardAdapterDefinitions[key]) {
    return null;
  }
  if (STANDARD_ADAPTER_OVERRIDES.has(key)) {
    return null;
  }
  return key;
}

function normalizeLanguage(value) {
  if (typeof value !== 'string') {
    return 'java';
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'python') {
    return 'python';
  }
  if (normalized === 'javascript' || normalized === 'js') {
    return 'javascript';
  }
  if (normalized === 'typescript' || normalized === 'ts') {
    return 'typescript';
  }
  return 'java';
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function normalizeLanguageFilter(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim().toLowerCase();
  if (!trimmed || trimmed === 'all') {
    return null;
  }
  return normalizeLanguage(trimmed);
}

function normalizeDateFilter(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return trimmed;
}

function stripHtml(html) {
  if (!html) {
    return '';
  }
  const withoutTags = html.replace(/<[^>]*>/g, ' ');
  return withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeChallengeName(challengeId) {
  if (!challengeId) {
    return 'Unknown';
  }
  return challengeId
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function getTechBarDescriptionText(value) {
  if (!value) {
    return '';
  }
  const challengeId = typeof value === 'object' && value !== null
    ? value.challengeId || null
    : value;
  const folder = typeof value === 'object' && value !== null
    ? value.folder || value.challengeId || null
    : value;
  const cacheKey = challengeId || folder;
  if (cacheKey && techBarDescriptionCache.has(cacheKey)) {
    return techBarDescriptionCache.get(cacheKey);
  }
  try {
    const html = await getChallengeAssetContent({
      challengeId,
      folder,
      type: 'description_html'
    });
    if (!html) {
      if (cacheKey) {
        techBarDescriptionCache.set(cacheKey, '');
      }
      return '';
    }
    const text = stripHtml(html);
    if (cacheKey) {
      techBarDescriptionCache.set(cacheKey, text);
    }
    return text;
  } catch {
    if (cacheKey) {
      techBarDescriptionCache.set(cacheKey, '');
    }
    return '';
  }
}

async function evaluateTechBarLabel({
  client,
  challengeName,
  descriptionText,
  solution
}) {
  const systemPrompt = [
    'You are evaluating a coding interview submission against the Meta interview bar.',
    'Consider correctness, algorithmic approach, code quality, and overall interview readiness.',
    'Return only JSON with a single key "label" set to one of: not_met, met, exceeds.'
  ].join(' ');

  const userPrompt = [
    `Challenge: ${challengeName || 'Unknown'}`,
    descriptionText ? `Description: ${descriptionText}` : 'Description: (none provided)',
    'Submission:',
    solution
  ].join('\n\n');

  const response = await client.chat.completions.create({
    model: TECH_BAR_MODEL,
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  const content = response.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('OpenAI response missing content');
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse OpenAI JSON: ${content}`);
  }

  const label = parsed?.label;
  if (!TECH_BAR_LABELS.has(label)) {
    throw new Error(`Invalid label from OpenAI: ${label}`);
  }

  return label;
}

async function updateTechBarInFile({
  submissionId,
  challengeFolder,
  challengeId,
  status,
  label
}) {
  const folder = challengeFolder || challengeId || DEFAULT_CHALLENGE;
  const submissionsPath = join(__dirname, '../../data', folder, 'submissions.json');
  let submissions = [];
  try {
    const submissionsContent = await readFile(submissionsPath, 'utf8');
    submissions = JSON.parse(submissionsContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
  const submissionIndex = submissions.findIndex(sub => sub.id === submissionId);
  if (submissionIndex === -1) {
    return false;
  }
  submissions[submissionIndex].techBarStatus = status;
  submissions[submissionIndex].techBarLabel = label;
  await writeFile(submissionsPath, JSON.stringify(submissions, null, 2), 'utf8');
  return true;
}

async function updateTechBarForSubmission({
  submissionId,
  challengeFolder,
  challengeId,
  status,
  label,
  storedInDb
}) {
  if (storedInDb) {
    try {
      const result = updateSubmissionTechBarInDb(submissionId, status, label);
      if (result.changes > 0) {
        return true;
      }
    } catch (error) {
      console.warn(`Failed to update tech bar in DB for ${submissionId}: ${error.message}`);
    }
  }
  try {
    return await updateTechBarInFile({
      submissionId,
      challengeFolder,
      challengeId,
      status,
      label
    });
  } catch (error) {
    console.warn(`Failed to update tech bar in file for ${submissionId}: ${error.message}`);
    return false;
  }
}

async function evaluateTechBarForSubmission({
  submissionId,
  challengeId,
  solution,
  storedInDb
}) {
  try {
    const challenge = getChallenge(challengeId);
    const challengeFolder = challenge.folder || challengeId;
    const challengeName = challenge.name || normalizeChallengeName(challengeId);
    const trimmedSolution = typeof solution === 'string' ? solution.trim() : '';

    if (!trimmedSolution) {
      await updateTechBarForSubmission({
        submissionId,
        challengeFolder,
        challengeId,
        status: 'completed',
        label: 'no_submission',
        storedInDb
      });
      return;
    }

    const client = getOpenAiClient();
    if (!client) {
      console.warn('Missing OPENAI_API_KEY; skipping tech bar label evaluation.');
      return;
    }

    const descriptionText = await getTechBarDescriptionText({
      challengeId,
      folder: challengeFolder
    });
    const label = await evaluateTechBarLabel({
      client,
      challengeName,
      descriptionText,
      solution: trimmedSolution
    });

    await updateTechBarForSubmission({
      submissionId,
      challengeFolder,
      challengeId,
      status: 'completed',
      label,
      storedInDb
    });
  } catch (error) {
    console.warn(`Tech bar evaluation failed for submission ${submissionId}: ${error.message}`);
  }
}

function getLanguageAdapterPath(challenge, language, challengeId = null) {
  const normalizedLanguage = normalizeLanguage(language);

  if (challengeId) {
    try {
      const definition = getChallengeAdapterDefinition(challengeId);
      if (definition) {
        return `db-standard:${challengeId}:${normalizedLanguage}`;
      }
    } catch {
      // Ignore DB lookup failures; fall back to file-based adapters.
    }
  }

  if (challenge.adapter?.startsWith('standard:')) {
    const parts = challenge.adapter.split(':');
    const adapterKey = parts[1];
    if (adapterKey) {
      return `standard:${adapterKey}:${normalizedLanguage}`;
    }
  }

  const standardKey = getStandardAdapterKeyFromPath(challenge.adapter);
  if (standardKey) {
    return `standard:${standardKey}:${normalizedLanguage}`;
  }

  if (normalizedLanguage === 'python' && challenge.adapter.startsWith('./adapters/')) {
    return challenge.adapter.replace('./adapters/', './adapters/python/');
  }
  if (normalizedLanguage === 'javascript' && challenge.adapter.startsWith('./adapters/')) {
    return challenge.adapter.replace('./adapters/', './adapters/javascript/');
  }
  if (normalizedLanguage === 'typescript' && challenge.adapter.startsWith('./adapters/')) {
    return challenge.adapter.replace('./adapters/', './adapters/typescript/');
  }
  return challenge.adapter;
}

function getTemplateFilename(language) {
  if (language === 'python') {
    return 'template.py';
  }
  if (language === 'javascript') {
    return 'template.js';
  }
  if (language === 'typescript') {
    return 'template.ts';
  }
  return 'template.java';
}

// Helper function to load test cases dynamically
async function loadTestCases(challengeId, language = 'java') {
  const challenge = getChallenge(challengeId);
  const adapterPath = getLanguageAdapterPath(challenge, language, challengeId);
  const adapter = await loadAdapter(adapterPath);

  let { runTests, submitTests } = await getChallengeTestCasesWithFallback({
    challengeId,
    challenge
  });
  
  // Apply adapter preprocessing if available
  if (adapter.preprocessTestCases) {
    runTests = adapter.preprocessTestCases(runTests);
    submitTests = adapter.preprocessTestCases(submitTests);
  }
  
  return {
    runTests,
    submitTests
  };
}

// One-time cleanup: Remove old files from root temp directory (migration from flat structure)
async function cleanupOldTempFiles() {
  try {
    const rootTempDir = join(__dirname, '../temp');
    
    // Check if root temp directory exists
    try {
      const stats = await stat(rootTempDir);
      if (!stats.isDirectory()) {
        return; // Not a directory, skip
      }
    } catch {
      return; // Directory doesn't exist, skip
    }
    
    // Read all files in root temp directory
    const files = await readdir(rootTempDir);
    
    // Filter to only Java/class files (not subdirectories)
    const filesToDelete = [];
    for (const file of files) {
      const filePath = join(rootTempDir, file);
      try {
        const fileStats = await stat(filePath);
        if (fileStats.isFile() && (file.endsWith('.java') || file.endsWith('.class'))) {
          filesToDelete.push(filePath);
        }
      } catch {
        // Skip files we can't stat
      }
    }
    
    // Delete old files
    if (filesToDelete.length > 0) {
      const deletePromises = filesToDelete.map(filePath => 
        unlink(filePath).catch(err => {
          console.warn(`Failed to delete old temp file ${filePath}:`, err.message);
        })
      );
      await Promise.all(deletePromises);
      console.log(`[Migration] Cleaned up ${filesToDelete.length} old file(s) from root temp directory`);
    }
  } catch (error) {
    // Log but don't fail on cleanup errors
    console.warn('[Migration] Error during old temp files cleanup:', error.message);
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// Export app for testing
export { app };

// In tests, force app.listen() to bind to localhost to avoid sandbox restrictions.
if (process.env.NODE_ENV === 'test') {
  const originalListen = app.listen.bind(app);
  app.listen = (...args) => {
    if (args.length < 1) {
      return originalListen();
    }
    if (typeof args[1] === 'string') {
      return originalListen(...args);
    }
    const port = args[0];
    const rest = args.slice(1);
    return originalListen(port, '127.0.0.1', ...rest);
  };
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function buildMockExecutionResult(testCases) {
  return {
    success: true,
    results: testCases.map((testCase) => ({
      testCase,
      actual: null,
      expected: testCase.expected ?? null,
      passed: false,
      executionTime: 0,
      stdout: ''
    }))
  };
}

function getOpenAiClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
}

const MIX_TARGET_SEEN_SHARE = 2 / 3;
const MIX_EMA_ALPHA = 0.2;
const RECOMMENDATION_TOPIC_WINDOW = 5;
const RECOMMENDATION_RECENT_DAYS = 14;
const RECOMMENDATION_MODEL = 'gpt-5';
const RETENTION_REVIEW_MIN_DAYS = 7;
const RETENTION_MASTERY_MAX = 0.75;
const RETENTION_UNSEEN_DIFFICULTY_RANK = {
  easy: 0,
  medium: 1,
  hard: 2
};
function normalizeDifficulty(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized;
  }
  return null;
}

function parseTopicsValue(rawTopics) {
  if (!rawTopics) {
    return [];
  }
  if (Array.isArray(rawTopics)) {
    return rawTopics
      .map((topic) => (typeof topic === 'string' ? topic.trim() : ''))
      .filter((topic) => topic.length > 0);
  }
  if (typeof rawTopics !== 'string') {
    return [];
  }
  try {
    const parsed = JSON.parse(rawTopics);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((topic) => (typeof topic === 'string' ? topic.trim() : ''))
      .filter((topic) => topic.length > 0);
  } catch {
    return [];
  }
}

function normalizeChallengeInput(challenge) {
  if (!challenge || typeof challenge !== 'object') {
    return null;
  }
  const id = typeof challenge.id === 'string'
    ? challenge.id.trim()
    : typeof challenge.challengeId === 'string'
      ? challenge.challengeId.trim()
      : '';
  if (!id) {
    return null;
  }
  const name = typeof challenge.name === 'string' && challenge.name.trim()
    ? challenge.name.trim()
    : id;
  const difficulty = normalizeDifficulty(challenge.difficulty);
  const topics = parseTopicsValue(challenge.topics);
  return { id, name, difficulty, topics };
}

function normalizeSubmissionInput(submission) {
  if (!submission || typeof submission !== 'object') {
    return null;
  }
  const challengeId = typeof submission.challenge_id === 'string'
    ? submission.challenge_id.trim()
    : typeof submission.challenge === 'string'
      ? submission.challenge.trim()
      : typeof submission.challengeId === 'string'
        ? submission.challengeId.trim()
        : '';
  if (!challengeId) {
    return null;
  }
  const language = typeof submission.language === 'string' ? normalizeLanguage(submission.language) : 'java';
  const guidanceLevel = typeof submission.guidance_level === 'string'
    ? submission.guidance_level
    : typeof submission.guidanceLevel === 'string'
      ? submission.guidanceLevel
      : 'Independent';

  return {
    id: submission.id,
    challenge_id: challengeId,
    challenge: submission.challenge ?? challengeId,
    challengeId: submission.challengeId ?? challengeId,
    challengeName: submission.challengeName,
    avg_time: submission.avg_time ?? submission.avgTime,
    timer_time: submission.timer_time ?? submission.timerTime,
    date: submission.date,
    submit_attempts: submission.submit_attempts ?? submission.submitAttempts,
    guidance_level: guidanceLevel,
    language
  };
}

function normalizeSubmissionsList(submissions) {
  return (submissions || [])
    .map(normalizeSubmissionInput)
    .filter(Boolean);
}

function inferLanguage(submissions, fallback) {
  if (typeof fallback === 'string' && fallback.trim()) {
    return normalizeLanguage(fallback);
  }
  const found = (submissions || []).find(
    (submission) => submission && typeof submission.language === 'string' && submission.language.trim()
  );
  if (found) {
    return normalizeLanguage(found.language);
  }
  return 'java';
}

function buildChallengeCatalog({ requestChallenges, submissions }) {
  const baseChallenges = Array.isArray(requestChallenges) && requestChallenges.length > 0
    ? requestChallenges
    : getAllChallenges();
  let normalized = (baseChallenges || [])
    .map(normalizeChallengeInput)
    .filter(Boolean);

  if (normalized.length === 0 && Array.isArray(submissions)) {
    const byId = new Map();
    for (const submission of submissions) {
      if (!submission || typeof submission !== 'object') {
        continue;
      }
      const challengeId = submission.challenge_id || submission.challenge || submission.challengeId;
      if (!challengeId || byId.has(challengeId)) {
        continue;
      }
      const name = typeof submission.challengeName === 'string' && submission.challengeName.trim()
        ? submission.challengeName.trim()
        : challengeId;
      byId.set(challengeId, {
        id: challengeId,
        name,
        difficulty: null,
        topics: []
      });
    }
    normalized = Array.from(byId.values());
  }

  return normalized;
}

function buildFitnessEntriesFromTopicFitness(topicFitness) {
  const entries = [];
  for (const entry of topicFitness || []) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const topic = typeof entry.topic === 'string' ? entry.topic.trim() : '';
    if (!topic) {
      continue;
    }
    for (const difficulty of ['easy', 'medium', 'hard']) {
      const fitnessValue = Number(entry?.[difficulty]?.fitness);
      entries.push({
        topic,
        difficulty,
        fitness: Number.isFinite(fitnessValue) ? fitnessValue : 0
      });
    }
  }
  return entries;
}

function computeTopicFitnessScore(entry) {
  if (!entry || typeof entry !== 'object') {
    return 0;
  }
  const values = ['easy', 'medium', 'hard'].map((difficulty) => {
    const fitness = Number(entry?.[difficulty]?.fitness);
    return Number.isFinite(fitness) ? fitness : 0;
  });
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalizeValues(values) {
  const numericValues = values.filter((value) => Number.isFinite(value));
  if (numericValues.length === 0) {
    return values.map(() => 0);
  }
  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);
  const range = max - min;
  if (range === 0) {
    return values.map((value) => (Number.isFinite(value) ? 0.5 : 0));
  }
  return values.map((value) => (Number.isFinite(value) ? (value - min) / range : 0));
}

function buildTopicPriorityMap(topicRetentionMetrics) {
  const map = new Map();
  for (const metric of topicRetentionMetrics || []) {
    if (!metric || typeof metric !== 'object') {
      continue;
    }
    const topic = typeof metric.topic === 'string' ? metric.topic.trim() : '';
    if (!topic) {
      continue;
    }
    const priorityValue = Number(metric.priority_score);
    const priority = Number.isFinite(priorityValue) ? priorityValue : 0;
    const existing = map.get(topic);
    if (!Number.isFinite(existing) || priority > existing) {
      map.set(topic, priority);
    }
  }
  return map;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Template endpoint - returns the template.java file content
app.get('/api/template', async (req, res) => {
  try {
    const challengeId = req.query.challenge || DEFAULT_CHALLENGE;
    const challenge = getChallenge(challengeId);
    const language = normalizeLanguage(req.query.language);
    const templateContent = await getChallengeAssetContent({
      challengeId,
      folder: challenge.folder,
      type: 'template',
      language,
      preferFile: process.env.NODE_ENV === 'test'
    });
    if (!templateContent) {
      throw new Error('Failed to load template');
    }
    res.json({ code: templateContent });
  } catch (error) {
    console.error('Template error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load template'
    });
  }
});

// Description endpoint - returns the description.html file content
app.get('/api/description', async (req, res) => {
  try {
    const challengeId = req.query.challenge || DEFAULT_CHALLENGE;
    const challenge = getChallenge(challengeId);
    const descriptionContent = await getChallengeAssetContent({
      challengeId,
      folder: challenge.folder,
      type: 'description_html',
      preferFile: process.env.NODE_ENV === 'test'
    });
    if (!descriptionContent) {
      throw new Error('Failed to load description');
    }
    res.json({ description: descriptionContent });
  } catch (error) {
    console.error('Description error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load description'
    });
  }
});

// Test cases endpoint - returns test cases for Run and Submit
app.get('/api/test-cases', async (req, res) => {
  try {
    const challengeId = req.query.challenge || DEFAULT_CHALLENGE;
    const language = normalizeLanguage(req.query.language);
    const { runTests, submitTests } = await loadTestCases(challengeId, language);
    
    // Load adapter to use extractInput() method
    const challenge = getChallenge(challengeId);
    const adapterPath = getLanguageAdapterPath(challenge, language, challengeId);
    const adapter = await loadAdapter(adapterPath);
    
    // Return test cases with only the information needed for preview (no expected output)
    // Use adapter's extractInput() to get input data, then normalize to a single 'input' field
    const runTestCases = runTests.map(test => {
      const extractedInput = adapter.extractInput(test);
      const fallbackValue = Object.values(extractedInput)[0] || null;
      const inputValue = test.input !== undefined ? test.input : fallbackValue;
      const normalizedInput = typeof inputValue === 'object' && inputValue !== null
        ? JSON.stringify(inputValue)
        : inputValue;
      return {
        id: test.id,
        name: test.name,
        input: normalizedInput
      };
    });
    
    const submitTestCases = submitTests.map(test => {
      const extractedInput = adapter.extractInput(test);
      const fallbackValue = Object.values(extractedInput)[0] || null;
      const inputValue = test.input !== undefined ? test.input : fallbackValue;
      const normalizedInput = typeof inputValue === 'object' && inputValue !== null
        ? JSON.stringify(inputValue)
        : inputValue;
      return {
        id: test.id,
        name: test.name,
        input: normalizedInput
      };
    });

    res.json({
      runTests: runTestCases,
      submitTests: submitTestCases
    });
  } catch (error) {
    console.error('Test cases error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
});

// Run endpoint - basic test cases (can run specific tests by ID)
app.post('/api/run', async (req, res) => {
  try {
    const { code, testIds, challenge: challengeId, language: rawLanguage } = req.body;
    const challenge = challengeId || DEFAULT_CHALLENGE;
    const language = normalizeLanguage(rawLanguage);

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }

    const challengeRecord = getChallenge(challenge);
    let runTests = [];
    let submitTests = [];
    if (process.env.MOCK_EXECUTION === '1') {
      ({ runTests, submitTests } = await loadTestCasesFromFile(challengeRecord));
    } else {
      ({ runTests, submitTests } = await loadTestCases(challenge, language));
    }

    // If testIds provided, filter to only those tests; otherwise use all runTests
    let testsToRun = runTests;
    if (testIds && Array.isArray(testIds) && testIds.length > 0) {
      const testLookup = new Map();
      runTests.forEach((test) => {
        testLookup.set(test.id, test);
      });
      submitTests.forEach((test) => {
        if (!testLookup.has(test.id)) {
          testLookup.set(test.id, test);
        }
      });

      const seen = new Set();
      testsToRun = [];
      testIds.forEach((id) => {
        if (seen.has(id)) {
          return;
        }
        const match = testLookup.get(id);
        if (match) {
          testsToRun.push(match);
          seen.add(id);
        }
      });
      if (testsToRun.length === 0) {
        return res.status(400).json({ error: 'No valid test IDs provided' });
      }
    }

    if (process.env.MOCK_EXECUTION === '1') {
      if (code.includes('invalid syntax')) {
        return res.json({
          success: false,
          error: 'Compilation error: mock',
          results: []
        });
      }
      if (code.includes('RuntimeException')) {
        return res.json({
          success: false,
          error: 'Runtime error: mock',
          results: []
        });
      }
      return res.json(buildMockExecutionResult(testsToRun));
    }

    const adapterPath = getLanguageAdapterPath(challengeRecord, language, challenge);
    const adapter = await loadAdapter(adapterPath);

    let result;
    if (language === 'python') {
      result = await executePythonCode(code, testsToRun, adapter, challenge);
    } else if (language === 'javascript') {
      result = await executeJavaScriptCode(code, testsToRun, adapter, challenge);
    } else if (language === 'typescript') {
      result = await executeTypeScriptCode(code, testsToRun, adapter, challenge);
    } else {
      result = await executeJavaCode(code, testsToRun, adapter, challenge);
    }

    res.json(result);
  } catch (error) {
    console.error('Run error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      results: []
    });
  }
});

// Submit endpoint - comprehensive test cases
app.post('/api/submit', async (req, res) => {
  try {
    const { code, challenge: challengeId, language: rawLanguage } = req.body;
    const challenge = challengeId || DEFAULT_CHALLENGE;
    const language = normalizeLanguage(rawLanguage);

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }

    const challengeRecord = getChallenge(challenge);
    let submitTests = [];
    if (process.env.MOCK_EXECUTION === '1') {
      ({ submitTests } = await loadTestCasesFromFile(challengeRecord));
    } else {
      ({ submitTests } = await loadTestCases(challenge, language));
    }

    if (process.env.MOCK_EXECUTION === '1') {
      if (code.includes('invalid syntax')) {
        return res.json({
          success: false,
          error: 'Compilation error: mock',
          results: []
        });
      }
      if (code.includes('RuntimeException')) {
        return res.json({
          success: false,
          error: 'Runtime error: mock',
          results: []
        });
      }
      const mockResult = buildMockExecutionResult(submitTests);
      // Calculate average time
      const totalTime = mockResult.results.reduce((sum, r) => sum + r.executionTime, 0);
      mockResult.avgTime = submitTests.length > 0 ? Math.round(totalTime / submitTests.length) : 0;
      mockResult.passed = mockResult.results.every(r => r.passed);
      return res.json(mockResult);
    }

    const adapterPath = getLanguageAdapterPath(challengeRecord, language, challenge);
    const adapter = await loadAdapter(adapterPath);

    let result;
    if (language === 'python') {
      result = await executePythonCode(code, submitTests, adapter, challenge);
    } else if (language === 'javascript') {
      result = await executeJavaScriptCode(code, submitTests, adapter, challenge);
    } else if (language === 'typescript') {
      result = await executeTypeScriptCode(code, submitTests, adapter, challenge);
    } else {
      result = await executeJavaCode(code, submitTests, adapter, challenge);
    }

    // Calculate average time
    if (result.success && result.results.length > 0) {
      const totalTime = result.results.reduce((sum, r) => sum + r.executionTime, 0);
      result.avgTime = Math.round(totalTime / submitTests.length);
      result.passed = result.results.every(r => r.passed);
    }

    res.json(result);
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      results: []
    });
  }
});

// Save endpoint - store implementation (for frontend to use with localStorage)
app.post('/api/save', (req, res) => {
  // This endpoint is mainly for consistency
  // Actual storage happens in frontend localStorage
  res.json({ success: true, message: 'Use localStorage in frontend' });
});

// Cleanup endpoint - clears challenge-specific temp directory
app.delete('/api/cleanup', async (req, res) => {
  try {
    const challengeId = req.query.challenge || DEFAULT_CHALLENGE;
    
    // Validate challenge exists
    getChallenge(challengeId);
    
    // Get challenge-specific temp directory
    const tempDir = join(__dirname, '../temp', challengeId);
    
    try {
      const entries = await readdir(tempDir, { withFileTypes: true });
      const filesToDelete = [];

      for (const entry of entries) {
        const entryPath = join(tempDir, entry.name);
        if (entry.isFile()) {
          filesToDelete.push(entryPath);
          continue;
        }
        if (entry.isDirectory()) {
          try {
            const nestedEntries = await readdir(entryPath);
            for (const nested of nestedEntries) {
              filesToDelete.push(join(entryPath, nested));
            }
          } catch {
            // Skip nested directories we can't read
          }
        }
      }

      const deletePromises = filesToDelete.map(filePath =>
        unlink(filePath).catch(err => {
          console.warn(`Failed to delete ${filePath}:`, err.message);
        })
      );

      await Promise.all(deletePromises);

      res.json({
        success: true,
        message: `Cleaned up ${filesToDelete.length} file(s) from ${challengeId} temp directory`
      });
    } catch (error) {
      // Directory might not exist, which is fine
      if (error.code === 'ENOENT') {
        res.json({ 
          success: true, 
          message: `Temp directory for ${challengeId} does not exist (already clean)` 
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to cleanup temp directory'
    });
  }
});

function resolveGlobalLanguagePreference() {
  const entry = getLanguagePreferenceFromDb(GLOBAL_LANGUAGE_PREFERENCE_KEY);
  if (entry?.language) {
    return entry;
  }
  const fallback = getLatestLanguagePreferenceFromDb(GLOBAL_LANGUAGE_PREFERENCE_KEY);
  if (fallback?.language) {
    const normalized = normalizeLanguage(fallback.language);
    setLanguagePreferenceInDb(GLOBAL_LANGUAGE_PREFERENCE_KEY, normalized);
    return { language: normalized };
  }
  return null;
}

// Language preference endpoints (global)
app.get('/api/language-preference', (req, res) => {
  try {
    const entry = resolveGlobalLanguagePreference();
    const language = entry?.language ? normalizeLanguage(entry.language) : null;
    res.json({ language });
  } catch (error) {
    console.error('Language preference error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load language preference'
    });
  }
});

app.post('/api/language-preference', (req, res) => {
  try {
    const { language: rawLanguage } = req.body || {};
    const language = normalizeLanguage(rawLanguage);
    setLanguagePreferenceInDb(GLOBAL_LANGUAGE_PREFERENCE_KEY, language);
    res.json({ success: true, language });
  } catch (error) {
    console.error('Save language preference error:', error);
    res.status(500).json({
      error: error.message || 'Failed to save language preference'
    });
  }
});

// Challenges endpoint - returns available challenges
app.get('/api/challenges', (req, res) => {
  try {
    // Try database first
    try {
      const dbChallenges = getAllChallenges();
      const challenges = dbChallenges.map(ch => ({
        id: ch.id,
        name: ch.name
      }));
      return res.json({ challenges });
    } catch (dbError) {
      // Fallback to CHALLENGES object
      const challenges = Object.entries(CHALLENGES).map(([id, config]) => ({
        id,
        name: config.name
      }));
      return res.json({ challenges });
    }
  } catch (error) {
    console.error('Challenges error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
});

// Get submissions endpoint - returns submissions for a challenge
app.get('/api/submissions', async (req, res) => {
  try {
    const scope = typeof req.query.scope === 'string' ? req.query.scope.trim().toLowerCase() : '';
    if (scope === 'all') {
      const page = parsePositiveInt(req.query.page, 1);
      const rawLimit = parsePositiveInt(req.query.limit, DEFAULT_SUBMISSIONS_PAGE_SIZE);
      const limit = Math.min(MAX_SUBMISSIONS_PAGE_SIZE, rawLimit);
      const offset = (page - 1) * limit;
      const language = normalizeLanguageFilter(req.query.language);
      const from = normalizeDateFilter(req.query.from);
      const to = normalizeDateFilter(req.query.to);

      // Try database first
      try {
        const submissions = getSubmissionsPage({ limit, offset, language, from, to });
        const total = getSubmissionsCount({ language, from, to });
        const formattedSubmissions = submissions.map(sub => ({
          id: sub.id,
          challenge: sub.challenge_id,
          avgTime: sub.avg_time,
          timerTime: sub.timer_time,
          date: sub.date,
          submitAttempts: sub.submit_attempts ?? null,
          techBarStatus: sub.tech_bar_status ?? 'pending',
          techBarLabel: sub.tech_bar_label ?? null,
          guidanceLevel: sub.guidance_level ?? 'Independent',
          language: normalizeLanguage(sub.language)
        }));

        return res.json({
          submissions: formattedSubmissions,
          page,
          limit,
          total,
          hasMore: offset + formattedSubmissions.length < total
        });
      } catch (dbError) {
        // Fallback to file-based if database fails
        const dataDir = join(__dirname, '../../data');
        const folders = await readdir(dataDir);
        const allSubmissions = [];

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
              continue;
            }
            submissions.forEach(submission => {
              if (!submission || typeof submission !== 'object') {
                return;
              }
              const normalized = {
                ...submission,
                challenge: submission.challenge ?? folder,
                submitAttempts: submission.submitAttempts ?? null,
                techBarStatus: submission.techBarStatus ?? 'pending',
                techBarLabel: submission.techBarLabel ?? null,
                guidanceLevel: submission.guidanceLevel ?? 'Independent',
                language: normalizeLanguage(submission.language)
              };
              allSubmissions.push(normalized);
            });
          } catch (error) {
            if (error.code === 'ENOENT') {
              continue;
            }
            throw error;
          }
        }

        const fromMs = from ? Date.parse(from) : null;
        const toMs = to ? Date.parse(to) : null;
        const filtered = allSubmissions.filter(submission => {
          if (language && normalizeLanguage(submission.language) !== language) {
            return false;
          }
          if (fromMs || toMs) {
            if (!submission.date) {
              return false;
            }
            const submittedAt = Date.parse(submission.date);
            if (Number.isNaN(submittedAt)) {
              return false;
            }
            if (fromMs && submittedAt < fromMs) {
              return false;
            }
            if (toMs && submittedAt > toMs) {
              return false;
            }
          }
          return true;
        });

        filtered.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        const total = filtered.length;
        const paged = filtered.slice(offset, offset + limit);

        return res.json({
          submissions: paged,
          page,
          limit,
          total,
          hasMore: offset + paged.length < total
        });
      }
    }

    const challengeId = req.query.challenge || DEFAULT_CHALLENGE;
    getChallenge(challengeId); // Validate challenge exists
    
    // Try database first
    try {
      const submissions = getSubmissionsFromDb(challengeId);
      // Convert database format to API format
      const formattedSubmissions = submissions.map(sub => ({
        id: sub.id,
        challenge: sub.challenge_id,
        avgTime: sub.avg_time,
        timerTime: sub.timer_time,
        date: sub.date,
        solution: sub.solution,
        submitAttempts: sub.submit_attempts ?? null,
        techBarStatus: sub.tech_bar_status ?? 'pending',
        techBarLabel: sub.tech_bar_label ?? null,
        guidanceLevel: sub.guidance_level ?? 'Independent',
        language: normalizeLanguage(sub.language)
      }));
      return res.json({ submissions: formattedSubmissions });
    } catch (dbError) {
      // Fallback to file-based if database fails
      const challenge = getChallenge(challengeId);
      const submissionsPath = join(__dirname, '../../data', challenge.folder, 'submissions.json');
      
      try {
        const submissionsContent = await readFile(submissionsPath, 'utf8');
        const submissions = JSON.parse(submissionsContent);
        submissions.sort((a, b) => new Date(b.date) - new Date(a.date));
        const formatted = submissions.map(submission => ({
          ...submission,
          submitAttempts: submission.submitAttempts ?? null,
          techBarStatus: submission.techBarStatus ?? 'pending',
          techBarLabel: submission.techBarLabel ?? null,
          guidanceLevel: submission.guidanceLevel ?? 'Independent',
          language: normalizeLanguage(submission.language)
        }));
        return res.json({ submissions: formatted });
      } catch (error) {
        if (error.code === 'ENOENT') {
          return res.json({ submissions: [] });
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load submissions'
    });
  }
});

// Recommend next challenge based on submission history
app.post('/api/recommend-next-challenge', async (req, res) => {
  try {
    const { submissions, challenges, language } = req.body || {};

    if (!Array.isArray(submissions)) {
      return res.status(400).json({ error: 'submissions must be an array' });
    }

    const dbSubmissions = getAllSubmissions();
    const normalizedSubmissions = dbSubmissions.length > 0
      ? normalizeSubmissionsList(dbSubmissions)
      : normalizeSubmissionsList(submissions);
    const normalizedLanguage = inferLanguage(normalizedSubmissions, language);
    const challengeCatalog = buildChallengeCatalog({
      requestChallenges: Array.isArray(challenges) ? challenges : [],
      submissions: normalizedSubmissions
    });

    if (challengeCatalog.length === 0) {
      return res.status(404).json({ error: 'No challenges available for recommendation' });
    }

    const submissionCount = dbSubmissions.length > 0
      ? getSubmissionsCount({ language: normalizedLanguage })
      : normalizedSubmissions.filter((submission) => submission.language === normalizedLanguage).length;
    const historyHash = buildRecommendationHistoryHash(normalizedLanguage, submissionCount);
    const cached = getNextChallengeRecommendationFromDb(historyHash);
    if (cached && cached.name && cached.explanation) {
      const cachedDifficulty = typeof cached.difficulty === 'string' && cached.difficulty !== 'unknown'
        ? cached.difficulty
        : null;
      return res.json({
        name: cached.name,
        difficulty: cachedDifficulty,
        explanation: cached.explanation,
        mode: cached.mode ?? null,
        topic: cached.topic ?? null,
        emaSeenShare: Number.isFinite(cached.ema_seen_share) ? cached.ema_seen_share : null,
        targetSeenShare: Number.isFinite(cached.target_seen_share) ? cached.target_seen_share : null
      });
    }

    const seenChallengeIds = new Set(
      normalizedSubmissions.map((submission) => submission.challenge_id).filter(Boolean)
    );
    const seenChallenges = challengeCatalog.filter((challenge) => seenChallengeIds.has(challenge.id));

    const topicFitness = buildTopicFitnessWithTransfer(
      challengeCatalog,
      normalizedSubmissions,
      normalizedLanguage
    );
    const fitnessEntries = buildFitnessEntriesFromTopicFitness(topicFitness);

    const topicRetentionMetrics = computeTopicRetentionMetricsData({
      challenges: challengeCatalog,
      submissions: normalizedSubmissions,
      fitnessEntries,
      language: normalizedLanguage
    });
    const retentionMetrics = computeRetentionMetricsData({
      challenges: challengeCatalog,
      submissions: normalizedSubmissions,
      fitnessEntries,
      language: normalizedLanguage
    });
    const retentionMetricsMap = new Map(
      retentionMetrics.map((metric) => [metric.challenge_id, metric])
    );

    const topicPriorityMap = buildTopicPriorityMap(topicRetentionMetrics);
    const sortedTopicPriorities = Array.from(topicPriorityMap.entries())
      .sort((a, b) => b[1] - a[1]);

    const topicFitnessScores = (topicFitness || []).map((entry) => ({
      topic: entry.topic,
      score: computeTopicFitnessScore(entry)
    }));
    topicFitnessScores.sort((a, b) => a.score - b.score);
    const topicFitnessScoreMap = new Map(
      topicFitnessScores.map((entry) => [entry.topic, entry.score])
    );

    const mixState = getRecommendationMixStateFromDb(normalizedLanguage);
    const currentSeenShare = Number.isFinite(mixState?.ema_seen_share)
      ? mixState.ema_seen_share
      : 0;
    let mode = currentSeenShare < MIX_TARGET_SEEN_SHARE ? 'seen' : 'new';

    const challengeNameById = new Map(
      challengeCatalog.map((challenge) => [challenge.id, challenge.name])
    );
    const catalogByName = new Map(
      challengeCatalog.map((challenge) => [challenge.name.toLowerCase(), challenge])
    );
    const catalogById = new Map(
      challengeCatalog.map((challenge) => [challenge.id.toLowerCase(), challenge])
    );

    const recentCutoffMs = Date.now() - RECOMMENDATION_RECENT_DAYS * 24 * 60 * 60 * 1000;
    const recentSubmissions = normalizedSubmissions.filter((submission) => {
      if (!submission || typeof submission !== 'object') {
        return false;
      }
      if (normalizeLanguage(submission.language) !== normalizedLanguage) {
        return false;
      }
      if (!submission.date) {
        return true;
      }
      const submittedAt = Date.parse(submission.date);
      if (Number.isNaN(submittedAt)) {
        return true;
      }
      return submittedAt >= recentCutoffMs;
    });

    const recentSummary = recentSubmissions.map((submission) => {
      const challengeId = submission.challenge_id;
      const challengeName = challengeNameById.get(challengeId)
        ?? submission.challengeName
        ?? challengeId;
      return {
        challengeId,
        challengeName,
        date: submission.date ?? null
      };
    });

    const recentLookup = new Set();
    for (const entry of recentSummary) {
      if (entry?.challengeId) {
        recentLookup.add(String(entry.challengeId).trim().toLowerCase());
      }
      if (entry?.challengeName) {
        recentLookup.add(String(entry.challengeName).trim().toLowerCase());
      }
    }

    const pickRetentionChallenge = () => {
      if (seenChallenges.length === 0 && challengeCatalog.length === 0) {
        return null;
      }

      const targetTopic = sortedTopicPriorities.length > 0
        ? sortedTopicPriorities[0][0]
        : null;

      const topicCandidates = targetTopic
        ? challengeCatalog.filter((challenge) => challenge.topics.includes(targetTopic))
        : seenChallenges;

      const seenInTopic = topicCandidates.filter((challenge) => seenChallengeIds.has(challenge.id));
      const unseenInTopic = topicCandidates.filter((challenge) => !seenChallengeIds.has(challenge.id));

      const buildBestSeen = (candidates) => {
        if (!candidates || candidates.length === 0) {
          return null;
        }
        const recencyValues = candidates.map(
          (challenge) => retentionMetricsMap.get(challenge.id)?.recency_days ?? 0
        );
        const submissionValues = candidates.map(
          (challenge) => retentionMetricsMap.get(challenge.id)?.submission_count ?? 0
        );
        const normalizedRecency = normalizeValues(recencyValues);
        const normalizedSubmissions = normalizeValues(submissionValues);

        let best = null;
        candidates.forEach((challenge, index) => {
          const metrics = retentionMetricsMap.get(challenge.id);
          const mastery = Number.isFinite(metrics?.mastery_score) ? metrics.mastery_score : 0.5;
          const score = 0.6 * normalizedRecency[index]
            + 0.3 * (1 - mastery)
            + 0.1 * (1 - normalizedSubmissions[index]);
          const lastSubmissionAt = metrics?.last_submission_at
            ? Date.parse(metrics.last_submission_at)
            : null;
          if (!best || score > best.score) {
            best = { challenge, metrics, score, lastSubmissionAt };
            return;
          }
          if (score === best.score) {
            const bestTimestamp = Number.isFinite(best.lastSubmissionAt) ? best.lastSubmissionAt : Infinity;
            const nextTimestamp = Number.isFinite(lastSubmissionAt) ? lastSubmissionAt : Infinity;
            if (nextTimestamp < bestTimestamp) {
              best = { challenge, metrics, score, lastSubmissionAt };
            }
          }
        });

        return best;
      };

      const buildTopicForChallenge = (challenge) => {
        if (targetTopic && challenge.topics.includes(targetTopic)) {
          return targetTopic;
        }
        let bestTopic = null;
        let bestPriority = -Infinity;
        for (const topic of challenge.topics) {
          const priority = topicPriorityMap.get(topic);
          if (Number.isFinite(priority) && priority > bestPriority) {
            bestPriority = priority;
            bestTopic = topic;
          }
        }
        return bestTopic;
      };

      const eligibleSeen = seenInTopic.filter((challenge) => {
        const metrics = retentionMetricsMap.get(challenge.id);
        const recencyDays = Number.isFinite(metrics?.recency_days) ? metrics.recency_days : 0;
        const mastery = Number.isFinite(metrics?.mastery_score) ? metrics.mastery_score : 1;
        return recencyDays >= RETENTION_REVIEW_MIN_DAYS && mastery < RETENTION_MASTERY_MAX;
      });

      const bestEligibleSeen = buildBestSeen(eligibleSeen);
      if (bestEligibleSeen) {
        const bestTopic = buildTopicForChallenge(bestEligibleSeen.challenge);
        const bestPriority = Number.isFinite(bestTopic ? topicPriorityMap.get(bestTopic) : null)
          ? topicPriorityMap.get(bestTopic)
          : null;
        return {
          challenge: bestEligibleSeen.challenge,
          topic: bestTopic,
          metrics: bestEligibleSeen.metrics,
          priority: bestPriority,
          kind: 'seen',
          reason: 'eligible'
        };
      }

      let unseenCandidates = unseenInTopic.filter((challenge) => {
        const idKey = challenge.id ? challenge.id.toLowerCase() : '';
        const nameKey = challenge.name ? challenge.name.toLowerCase() : '';
        if (idKey && recentLookup.has(idKey)) {
          return false;
        }
        if (nameKey && recentLookup.has(nameKey)) {
          return false;
        }
        return true;
      });

      if (unseenCandidates.length === 0) {
        unseenCandidates = unseenInTopic;
      }

      if (unseenCandidates.length > 0) {
        const sortedUnseen = unseenCandidates
          .map((challenge) => ({
            challenge,
            difficultyRank: RETENTION_UNSEEN_DIFFICULTY_RANK[challenge.difficulty] ?? 3
          }))
          .sort((a, b) => {
            if (a.difficultyRank !== b.difficultyRank) {
              return a.difficultyRank - b.difficultyRank;
            }
            return a.challenge.name.localeCompare(b.challenge.name);
          });
        const bestUnseen = sortedUnseen[0];
        const bestTopic = buildTopicForChallenge(bestUnseen.challenge);
        const bestPriority = Number.isFinite(bestTopic ? topicPriorityMap.get(bestTopic) : null)
          ? topicPriorityMap.get(bestTopic)
          : null;
        return {
          challenge: bestUnseen.challenge,
          topic: bestTopic,
          metrics: null,
          priority: bestPriority,
          kind: 'unseen',
          reason: 'practice'
        };
      }

      const fallbackSeen = buildBestSeen(seenInTopic);
      if (!fallbackSeen) {
        return null;
      }
      const fallbackTopic = buildTopicForChallenge(fallbackSeen.challenge);
      const fallbackPriority = Number.isFinite(fallbackTopic ? topicPriorityMap.get(fallbackTopic) : null)
        ? topicPriorityMap.get(fallbackTopic)
        : null;
      return {
        challenge: fallbackSeen.challenge,
        topic: fallbackTopic,
        metrics: fallbackSeen.metrics,
        priority: fallbackPriority,
        kind: 'seen',
        reason: 'fallback'
      };
    };

    const pickNewChallengeWithAi = async () => {
      const client = getOpenAiClient();
      if (!client) {
        const error = new Error('Missing OPENAI_API_KEY');
        error.statusCode = 503;
        throw error;
      }

      const systemPrompt = [
        'You are a coach recommending the next LeetCode challenge.',
        'Do not choose any challenge attempted in the last 14 days.',
        'Use topic fitness; lower fitness = higher priority.',
        'Prefer foundational topics and easier problems first.',
        'Return only JSON with keys: name, explanation.'
      ].join(' ');

      const userPrompt = [
        'Topic fitness (JSON):',
        JSON.stringify(topicFitness),
        'Recent submissions (last 14 days; do not recommend):',
        JSON.stringify(recentSummary)
      ].join('\n\n');

      let lastError = 'Failed to generate recommendation';
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const retryNote = attempt > 0
          ? 'Your previous response was invalid. Choose a different challenge name that follows the rules.'
          : null;
        const messages = retryNote
          ? [
            { role: 'system', content: systemPrompt },
            { role: 'system', content: retryNote },
            { role: 'user', content: userPrompt }
          ]
          : [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ];

        const response = await client.chat.completions.create({
          model: RECOMMENDATION_MODEL,
          response_format: { type: 'json_object' },
          messages
        });

        const content = response.choices?.[0]?.message?.content?.trim();
        if (!content) {
          lastError = 'OpenAI response missing content';
          continue;
        }

        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch {
          lastError = 'Failed to parse OpenAI JSON response';
          continue;
        }

        const name = typeof parsed?.name === 'string' ? parsed.name.trim() : '';
        const explanation = typeof parsed?.explanation === 'string' ? parsed.explanation.trim() : '';
        if (!name || !explanation) {
          lastError = 'OpenAI response missing required fields';
          continue;
        }

        if (recentLookup.has(name.toLowerCase())) {
          lastError = 'OpenAI response violates the 14-day rule';
          continue;
        }

        const matched = catalogByName.get(name.toLowerCase())
          ?? catalogById.get(name.toLowerCase())
          ?? null;
        let weakestTopic = null;
        if (matched && Array.isArray(matched.topics)) {
          for (const topic of matched.topics) {
            const score = topicFitnessScoreMap.get(topic);
            if (!Number.isFinite(score)) {
              continue;
            }
            if (weakestTopic === null || score < (topicFitnessScoreMap.get(weakestTopic) ?? 1)) {
              weakestTopic = topic;
            }
          }
        }

        return {
          name,
          explanation,
          challenge: matched,
          topic: weakestTopic
        };
      }

      const error = new Error(lastError);
      error.statusCode = 502;
      throw error;
    };

    let selection;
    try {
      selection = mode === 'seen' ? pickRetentionChallenge() : await pickNewChallengeWithAi();
      if (!selection) {
        mode = mode === 'seen' ? 'new' : 'seen';
        selection = mode === 'seen' ? pickRetentionChallenge() : await pickNewChallengeWithAi();
      }
    } catch (error) {
      if (error?.statusCode) {
        return res.status(error.statusCode).json({ error: error.message || 'Failed to recommend challenge' });
      }
      throw error;
    }

    if (!selection) {
      return res.status(404).json({ error: 'No challenge available for recommendation' });
    }

    const isSeenPick = mode === 'seen';
    const updatedSeenShare = MIX_EMA_ALPHA * (isSeenPick ? 1 : 0)
      + (1 - MIX_EMA_ALPHA) * currentSeenShare;
    try {
      upsertRecommendationMixStateToDb({
        language: normalizedLanguage,
        ema_seen_share: updatedSeenShare
      });
    } catch (dbError) {
      console.warn('Failed to update recommendation mix state:', dbError.message);
    }

    let explanation = '';
    if (mode === 'seen') {
      const topicText = selection.topic ? `topic "${selection.topic}"` : 'a high-priority topic';
      if (selection.kind === 'unseen') {
        const parts = [
          `Topic practice pick from ${topicText}.`,
          'No recent review candidate met the recency/mastery threshold.'
        ];
        explanation = parts.join(' ');
      } else {
        const daysAgo = Number.isFinite(selection.metrics?.recency_days)
          ? Math.round(selection.metrics.recency_days)
          : null;
        const mastery = Number.isFinite(selection.metrics?.mastery_score)
          ? selection.metrics.mastery_score.toFixed(2)
          : null;
        const priority = Number.isFinite(selection.priority)
          ? selection.priority.toFixed(2)
          : null;
        const parts = [
          `Retention pick from ${topicText}.`
        ];
        if (priority) {
          parts.push(`Priority score ${priority}.`);
        }
        if (daysAgo !== null) {
          parts.push(`Last attempt ${daysAgo} days ago.`);
        }
        if (mastery) {
          parts.push(`Mastery score ${mastery}.`);
        }
        if (selection.reason === 'fallback') {
          parts.push('Fallback review pick due to limited new options.');
        }
        explanation = parts.join(' ');
      }
    } else {
      explanation = selection.explanation ?? '';
    }

    const difficulty = selection.challenge?.difficulty ?? null;
    const recommendedName = mode === 'new' ? selection.name : selection.challenge.name;
    const responsePayload = {
      name: recommendedName,
      difficulty,
      explanation,
      mode,
      topic: selection.topic ?? null,
      emaSeenShare: updatedSeenShare,
      targetSeenShare: MIX_TARGET_SEEN_SHARE
    };

    try {
      const modelName = mode === 'new' ? RECOMMENDATION_MODEL : 'retention';
      upsertNextChallengeRecommendationToDb({
        history_hash: historyHash,
        name: recommendedName,
        difficulty: typeof difficulty === 'string' && difficulty ? difficulty : 'unknown',
        explanation,
        model: modelName,
        mode,
        topic: selection.topic ?? null,
        ema_seen_share: updatedSeenShare,
        target_seen_share: MIX_TARGET_SEEN_SHARE
      });
    } catch (dbError) {
      console.warn('Failed to update recommendation cache:', dbError.message);
    }

    return res.json(responsePayload);
  } catch (error) {
    console.error('Recommend next challenge error:', error);
    return res.status(500).json({ error: error.message || 'Failed to recommend challenge' });
  }
});

// Daily progress report endpoint - returns an encouraging summary
app.post('/api/progress-report', async (req, res) => {
  try {
    const { submissions, dateKey } = req.body || {};

    if (!Array.isArray(submissions)) {
      return res.status(400).json({ error: 'submissions must be an array' });
    }

    if (submissions.length === 0) {
      return res.status(400).json({ error: 'submissions must not be empty' });
    }

    const client = getOpenAiClient();
    if (!client) {
      return res.status(503).json({ error: 'Missing OPENAI_API_KEY' });
    }

    const sanitizedSubmissions = submissions.map((submission) => {
      if (!submission || typeof submission !== 'object') {
        return submission;
      }
      const cleaned = { ...submission };
      delete cleaned.solution;
      delete cleaned.code;
      return cleaned;
    });

    const summary = buildProgressSummary(sanitizedSubmissions);
    const systemPrompt = [
      'You are a supportive coding coach writing a daily progress report.',
      'Be encouraging, concise, and specific.',
      'Mention the submission count and one concrete highlight.',
      'Guidance labels: Independent = no help, Minor = small hints, Guided = significant AI guidance.',
      'Use 4-6 sentences in plain text or markdown.',
      'No emojis and no exclamation marks.',
      'End with a gentle next-step suggestion.'
    ].join(' ');

    const userPrompt = [
      `Date: ${dateKey || 'today'}`,
      'Progress summary (JSON):',
      JSON.stringify(summary, null, 2)
    ].join('\n\n');

    const response = await client.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    const report = response.choices?.[0]?.message?.content?.trim();
    if (!report) {
      return res.status(502).json({ error: 'OpenAI response missing content' });
    }

    return res.json({ report });
  } catch (error) {
    console.error('Progress report error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate progress report' });
  }
});

// "Guide me" endpoint - returns a guided chat response
app.post('/api/guide-chat', async (req, res) => {
  try {
    const {
      code,
      challengeId,
      challengeName,
      language,
      descriptionHtml,
      testCasesPreview,
      messages
    } = req.body || {};

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'code is required' });
    }

    const client = getOpenAiClient();
    if (!client) {
      return res.status(503).json({ error: 'Missing OPENAI_API_KEY' });
    }

    const systemPrompt = process.env.GUIDE_TEACHER_SYSTEM_PROMPT || `## STRICT RULES
Be an approachable-yet-dynamic teacher, who helps the user learn by guiding them through their studies.
1. **Get to know the user.** If you don't know their goals or grade level, ask the user before diving in. (Keep this lightweight!) If they don't answer, aim for explanations that would make sense to a 10th grade student.
2. **Build on existing knowledge.** Connect new ideas to what the user already knows.
3. **Guide users, don't just give answers.** Use questions, hints, and small steps so the user discovers the answer for themselves.
4. **Check and reinforce.** After hard parts, confirm the user can restate or use the idea. Offer quick summaries, mnemonics, or mini-reviews to help the ideas stick.
5. **Vary the rhythm.** Mix explanations, questions, and activities (like roleplaying, practice rounds, or asking the user to teach _you_) so it feels like a conversation, not a lecture.
Above all: **DO NOT DO THE USER'S WORK FOR THEM.** Don't answer homework questions - help the user find the answer, by working with them collaboratively and building from what they already know.
---
## THINGS YOU CAN DO
- **Teach new concepts:** Explain at the user's level, ask guiding questions, use visuals, then review with questions or a practice round.
- **Help with homework:** Don't simply give answers! Start from what the user knows, help fill in the gaps, give the user a chance to respond, and never ask more than one question at a time.
- **Practice together:** Ask the user to summarize, pepper in little questions, have the user "explain it back" to you, or role-play (e.g., practice conversations in a different language). Correct mistakes - charitably! - in the moment.
- **Quizzes & test prep:** Run practice quizzes. (One question at a time!) Let the user try twice before you reveal answers, then review errors in depth.
---
## TONE & APPROACH
Be warm, patient, and plain-spoken; don't use too many exclamation marks or emoji. Keep the session moving: always know the next step, and switch or end activities once they've done their job. And be brief - don't ever send essay-length responses. Aim for a good back-and-forth.
---
## IMPORTANT
**DO NOT GIVE ANSWERS OR DO HOMEWORK FOR THE USER.** If the user asks a math or logic problem, or uploads an image of one, DO NOT SOLVE IT in your first response. Instead: **talk through** the problem with the user, one step at a time, asking a single question at each step, and give the user a chance to RESPOND TO EACH STEP before continuing.`;

    const displayChallenge = challengeName || challengeId || 'unknown';
    const contextPrompt = [
      `Challenge: ${displayChallenge}`,
      `Language: ${language || 'unknown'}`,
      'Description (HTML):',
      descriptionHtml || '',
      'Test cases preview:',
      JSON.stringify(testCasesPreview ?? {}, null, 2),
      'User code:',
      code
    ].join('\n\n');

    const conversation = Array.isArray(messages) ? messages : [];
    const sanitizedMessages = conversation
      .filter((message) => message && typeof message.content === 'string')
      .map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content.trim()
      }))
      .filter((message) => message.content.length > 0);

    const response = await client.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'system', content: `Context:\n${contextPrompt}` },
        ...sanitizedMessages
      ]
    });

    const answer = response.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      return res.status(502).json({ error: 'OpenAI response missing content' });
    }

    return res.json({ answer });
  } catch (error) {
    console.error('Guide chat error:', error);
    return res.status(500).json({ error: error.message || 'Failed to get guided response' });
  }
});

// "Where's the bug?" endpoint - returns a markdown hint
app.post('/api/bug-hunt', async (req, res) => {
  try {
    const {
      code,
      challengeId,
      challengeName,
      language,
      descriptionHtml,
      testCasesPreview
    } = req.body || {};

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'code is required' });
    }

    const client = getOpenAiClient();
    if (!client) {
      return res.status(503).json({ error: 'Missing OPENAI_API_KEY' });
    }

    const systemPrompt = [
      "You're a senior debugging assistant.",
      "Where's the bug? Answer in markdown.",
      'Be concise, concrete, and actionable.',
      'Use at most one short paragraph or a short bullet list.',
      'Only provide full code if a significant or material rewrite is necessary or the high-level approach is mostly off.'
    ].join(' ');

    const displayChallenge = challengeName || challengeId || 'unknown';
    const userPrompt = [
      `Challenge: ${displayChallenge}`,
      `Language: ${language || 'unknown'}`,
      'Description (HTML):',
      descriptionHtml || '',
      'Test cases preview:',
      JSON.stringify(testCasesPreview ?? {}, null, 2),
      'User code:',
      code
    ].join('\n\n');

    const response = await client.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    const answer = response.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      return res.status(502).json({ error: 'OpenAI response missing content' });
    }

    return res.json({ answer });
  } catch (error) {
    console.error('Bug hunt error:', error);
    return res.status(500).json({ error: error.message || 'Failed to get bug hint' });
  }
});

// Evaluate whether bug hint is significant enough to disable minor guidance
app.post('/api/bug-hunt-evaluate', async (req, res) => {
  try {
    const {
      code,
      challengeId,
      challengeName,
      language,
      descriptionHtml,
      testCasesPreview,
      bugAnswer
    } = req.body || {};

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'code is required' });
    }
    if (!bugAnswer || typeof bugAnswer !== 'string') {
      return res.status(400).json({ error: 'bugAnswer is required' });
    }

    const client = getOpenAiClient();
    if (!client) {
      return res.status(503).json({ error: 'Missing OPENAI_API_KEY' });
    }

    const systemPrompt = [
      "You evaluate if a debugging hint is so significant that 'Minor hint' should be disabled.",
      "A significant hint gives away the key insight or near-complete fix.",
      "A minor hint is a light nudge that doesn't reveal the main solution.",
      "Return JSON: {\"disableMinor\": boolean, \"rationale\": string}."
    ].join(' ');

    const displayChallenge = challengeName || challengeId || 'unknown';
    const userPrompt = [
      `Challenge: ${displayChallenge}`,
      `Language: ${language || 'unknown'}`,
      'Description (HTML):',
      descriptionHtml || '',
      'Test cases preview:',
      JSON.stringify(testCasesPreview ?? {}, null, 2),
      'User code:',
      code,
      'Bug hint answer:',
      bugAnswer
    ].join('\n\n');

    const response = await client.chat.completions.create({
      model: 'gpt-5',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return res.status(502).json({ error: 'OpenAI response missing content' });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      return res.status(502).json({ error: 'Failed to parse OpenAI JSON response' });
    }

    const disableMinor = typeof parsed?.disableMinor === 'boolean' ? parsed.disableMinor : null;
    const rationale = typeof parsed?.rationale === 'string' ? parsed.rationale.trim() : '';

    if (disableMinor === null) {
      return res.status(502).json({ error: 'OpenAI response missing disableMinor boolean' });
    }

    return res.json({ disableMinor, rationale });
  } catch (error) {
    console.error('Bug hint evaluation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to evaluate bug hint' });
  }
});

// Save submission endpoint - saves a submission to database (and file as backup)
app.post('/api/submissions', async (req, res) => {
  try {
    const { challenge: challengeId, avgTime, timerTime, date, solution, guidanceLevel, submitAttempts, language: rawLanguage } = req.body;
    const language = normalizeLanguage(rawLanguage);
    let storedInDb = false;

    if (!challengeId) {
      return res.status(400).json({ error: 'Challenge is required' });
    }
    
    if (avgTime === undefined || timerTime === undefined || !date) {
      return res.status(400).json({ error: 'avgTime, timerTime, and date are required' });
    }
    
    getChallenge(challengeId); // Validate challenge exists
    
    // Create new submission object
    const submissionId = randomUUID();
    const newSubmission = {
      id: submissionId,
      challenge_id: challengeId,
      avg_time: Number(avgTime),
      timer_time: Number(timerTime),
      date: date,
      solution: solution ?? null,
      submit_attempts: submitAttempts ?? null,
      tech_bar_status: 'pending',
      tech_bar_label: null,
      guidance_level: guidanceLevel ?? 'Independent',
      language
    };
    
    // Save to database
    try {
      insertSubmissionToDb(newSubmission);
      storedInDb = true;
    } catch (dbError) {
      console.warn('Failed to save submission to database, falling back to file:', dbError.message);
      // Fallback to file-based storage
      const challenge = getChallenge(challengeId);
      const dataDir = join(__dirname, '../../data', challenge.folder);
      const submissionsPath = join(dataDir, 'submissions.json');
      
      await mkdir(dataDir, { recursive: true }).catch(() => {});
      
      let submissions = [];
      try {
        const submissionsContent = await readFile(submissionsPath, 'utf8');
        submissions = JSON.parse(submissionsContent);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }
      
      const fileSubmission = {
        id: submissionId,
        challenge: challengeId,
        avgTime: Number(avgTime),
        timerTime: Number(timerTime),
        date: date,
        solution: solution ?? null,
        submitAttempts: submitAttempts ?? null,
        techBarStatus: 'pending',
        techBarLabel: null,
        guidanceLevel: guidanceLevel ?? 'Independent',
        language
      };
      
      submissions.push(fileSubmission);
      submissions.sort((a, b) => new Date(b.date) - new Date(a.date));
      await writeFile(submissionsPath, JSON.stringify(submissions, null, 2), 'utf8');
    }
    
    // Return in API format
    const apiSubmission = {
      id: submissionId,
      challenge: challengeId,
      avgTime: Number(avgTime),
      timerTime: Number(timerTime),
      date: date,
      solution: solution ?? null,
      submitAttempts: submitAttempts ?? null,
      techBarStatus: 'pending',
      techBarLabel: null,
      guidanceLevel: guidanceLevel ?? 'Independent',
      language
    };

    setImmediate(() => {
      try {
        createFitnessSnapshot();
      } catch (snapshotError) {
        console.error('Fitness snapshot error:', snapshotError);
      }
      try {
        refreshRetentionMetrics({ language });
      } catch (retentionError) {
        console.error('Retention metrics error:', retentionError);
      }
      void evaluateTechBarForSubmission({
        submissionId,
        challengeId,
        solution,
        storedInDb
      });
    });
    
    res.json({ success: true, submission: apiSubmission });
  } catch (error) {
    console.error('Save submission error:', error);
    res.status(500).json({
      error: error.message || 'Failed to save submission'
    });
  }
});

// Delete submission endpoint - deletes a submission by ID
app.delete('/api/submissions', async (req, res) => {
  try {
    const submissionId = req.query.id;
    const challengeId = req.query.challenge || DEFAULT_CHALLENGE;
    
    if (!submissionId) {
      return res.status(400).json({ error: 'Submission ID is required' });
    }
    
    getChallenge(challengeId); // Validate challenge exists
    
    // Try database first
    try {
      const result = deleteSubmissionFromDb(submissionId);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      return res.json({ success: true, message: 'Submission deleted successfully' });
    } catch (dbError) {
      // Fallback to file-based if database fails
      const challenge = getChallenge(challengeId);
      const submissionsPath = join(__dirname, '../../data', challenge.folder, 'submissions.json');
      
      let submissions = [];
      try {
        const submissionsContent = await readFile(submissionsPath, 'utf8');
        submissions = JSON.parse(submissionsContent);
      } catch (error) {
        if (error.code === 'ENOENT') {
          return res.status(404).json({ error: 'Submission not found' });
        }
        throw error;
      }
      
      const initialLength = submissions.length;
      submissions = submissions.filter(sub => sub.id !== submissionId);
      
      if (submissions.length === initialLength) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      await writeFile(submissionsPath, JSON.stringify(submissions, null, 2), 'utf8');
      return res.json({ success: true, message: 'Submission deleted successfully' });
    }
  } catch (error) {
    console.error('Delete submission error:', error);
    res.status(500).json({
      error: error.message || 'Failed to delete submission'
    });
  }
});

// Update submission endpoint - updates a submission's timer time
app.put('/api/submissions', async (req, res) => {
  try {
    const { id, timerTime, challenge: challengeId } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Submission ID is required' });
    }
    
    if (timerTime === undefined || timerTime === null) {
      return res.status(400).json({ error: 'timerTime is required' });
    }
    
    const finalChallengeId = challengeId || DEFAULT_CHALLENGE;
    getChallenge(finalChallengeId); // Validate challenge exists
    
    // Try database first
    try {
      const result = updateSubmissionInDb(id, Number(timerTime));
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      // Get updated submission
      const updatedSubmission = getSubmissionByIdFromDb(id);
      if (!updatedSubmission) {
        return res.status(404).json({ error: 'Submission not found after update' });
      }
      
      // Return in API format
      const apiSubmission = {
        id: updatedSubmission.id,
        challenge: updatedSubmission.challenge_id,
        avgTime: updatedSubmission.avg_time,
        timerTime: updatedSubmission.timer_time,
        date: updatedSubmission.date,
        techBarStatus: updatedSubmission.tech_bar_status ?? 'pending',
        techBarLabel: updatedSubmission.tech_bar_label ?? null,
        guidanceLevel: updatedSubmission.guidance_level ?? 'Independent'
      };
      
      return res.json({ success: true, submission: apiSubmission });
    } catch (dbError) {
      // Fallback to file-based if database fails
      const challenge = getChallenge(finalChallengeId);
      const submissionsPath = join(__dirname, '../../data', challenge.folder, 'submissions.json');
      
      let submissions = [];
      try {
        const submissionsContent = await readFile(submissionsPath, 'utf8');
        submissions = JSON.parse(submissionsContent);
      } catch (error) {
        if (error.code === 'ENOENT') {
          return res.status(404).json({ error: 'Submission not found' });
        }
        throw error;
      }
      
      const submissionIndex = submissions.findIndex(sub => sub.id === id);
      if (submissionIndex === -1) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      // Update the submission
      submissions[submissionIndex].timerTime = Number(timerTime);
      submissions[submissionIndex].techBarStatus = submissions[submissionIndex].techBarStatus ?? 'pending';
      submissions[submissionIndex].techBarLabel = submissions[submissionIndex].techBarLabel ?? null;
      submissions[submissionIndex].guidanceLevel = submissions[submissionIndex].guidanceLevel ?? 'Independent';
      await writeFile(submissionsPath, JSON.stringify(submissions, null, 2), 'utf8');
      
      return res.json({ success: true, submission: submissions[submissionIndex] });
    }
  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({
      error: error.message || 'Failed to update submission'
    });
  }
});

// Challenge metadata endpoints

// Get all challenges with metadata
app.get('/api/challenges/metadata', (req, res) => {
  try {
    const dbChallenges = getAllChallenges();
    const challenges = dbChallenges.map(ch => ({
      id: ch.id,
      name: ch.name,
      folder: ch.folder,
      difficulty: ch.difficulty,
      topics: JSON.parse(ch.topics || '[]'),
      created_at: ch.created_at,
      updated_at: ch.updated_at
    }));
    res.json({ challenges });
  } catch (error) {
    console.error('Get challenges metadata error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load challenges metadata'
    });
  }
});

function buildProgressSummary(submissions) {
  const challengeCounts = new Map();
  const languageCounts = new Map();
  const guidanceCounts = new Map();
  let avgTimeTotal = 0;
  let avgTimeCount = 0;
  let timerTimeTotal = 0;
  let timerTimeCount = 0;
  let untrackedTimerCount = 0;
  let lastSubmission = null;

  for (const submission of submissions) {
    if (!submission || typeof submission !== 'object') {
      continue;
    }

    const challengeName = typeof submission.challengeName === 'string' && submission.challengeName.trim()
      ? submission.challengeName.trim()
      : typeof submission.challenge === 'string' && submission.challenge.trim()
        ? submission.challenge.trim()
        : 'Unknown';
    challengeCounts.set(challengeName, (challengeCounts.get(challengeName) || 0) + 1);

    const language = typeof submission.language === 'string' && submission.language.trim()
      ? submission.language.trim().toLowerCase()
      : 'unknown';
    languageCounts.set(language, (languageCounts.get(language) || 0) + 1);

    const guidance = typeof submission.guidanceLevel === 'string' && submission.guidanceLevel.trim()
      ? submission.guidanceLevel.trim()
      : 'Independent';
    guidanceCounts.set(guidance, (guidanceCounts.get(guidance) || 0) + 1);

    const avgTime = Number(submission.avgTime);
    if (Number.isFinite(avgTime) && avgTime >= 0) {
      avgTimeTotal += avgTime;
      avgTimeCount += 1;
    }

    const timerTime = Number(submission.timerTime);
    if (Number.isFinite(timerTime)) {
      if (timerTime < 0) {
        untrackedTimerCount += 1;
      } else {
        timerTimeTotal += timerTime;
        timerTimeCount += 1;
      }
    }

    const submittedAt = Date.parse(submission.date);
    if (Number.isFinite(submittedAt)) {
      if (!lastSubmission || submittedAt > lastSubmission) {
        lastSubmission = submittedAt;
      }
    }
  }

  const challengeBreakdown = Array.from(challengeCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const languageBreakdown = Array.from(languageCounts.entries())
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);
  const guidanceBreakdown = Array.from(guidanceCounts.entries())
    .reduce((acc, [level, count]) => {
      acc[level] = count;
      return acc;
    }, {});

  return {
    totalSubmissions: submissions.length,
    uniqueChallenges: challengeBreakdown.length,
    challengeBreakdown,
    languageBreakdown,
    guidanceBreakdown,
    avgRuntimeMs: avgTimeCount > 0 ? Math.round(avgTimeTotal / avgTimeCount) : null,
    totalTimerTimeMs: timerTimeCount > 0 ? timerTimeTotal : null,
    untrackedTimerCount,
    lastSubmission: lastSubmission ? new Date(lastSubmission).toISOString() : null
  };
}

function buildTopicFitnessCore(challenges, submissions) {
  const allTopics = new Set();
  const challengeTopics = {};
  const challengeDifficulty = {};

  for (const challenge of challenges) {
    let topics = [];
    try {
      const parsed = JSON.parse(challenge.topics || '[]');
      topics = Array.isArray(parsed) ? parsed : [];
    } catch (parseError) {
      topics = [];
    }
    const normalizedTopics = topics
      .map((topic) => (typeof topic === 'string' ? topic.trim() : ''))
      .filter((topic) => topic.length > 0);
    normalizedTopics.forEach((topic) => allTopics.add(topic));
    challengeTopics[challenge.id] = normalizedTopics;
    if (typeof challenge.difficulty === 'string') {
      challengeDifficulty[challenge.id] = challenge.difficulty.trim().toLowerCase();
    }
  }

  const now = Date.now();
  const timeBaselineMs = 20 * 60 * 1000;
  const difficultyLevels = ['easy', 'medium', 'hard'];
  const topicStats = {};

  const createStat = () => ({
    totalFitness: 0,
    totalWeight: 0,
    submissionCount: 0,
    lastSubmission: null
  });

  const guidanceScores = {
    Independent: 1,
    Minor: 0.7,
    Guided: 0.4
  };

  for (const topic of allTopics) {
    const difficultyStats = {};
    for (const level of difficultyLevels) {
      difficultyStats[level] = createStat();
    }
    topicStats[topic] = {
      topic,
      difficulties: difficultyStats,
      overall: createStat()
    };
  }

  for (const submission of submissions) {
    const topics = challengeTopics[submission.challenge_id] || [];
    if (topics.length === 0) {
      continue;
    }
    const difficulty = challengeDifficulty[submission.challenge_id];
    if (!difficultyLevels.includes(difficulty)) {
      continue;
    }

    const guidanceLevel = submission.guidance_level || 'Independent';
    const guidanceScore = guidanceScores[guidanceLevel] ?? 0.7;

    const attemptsRaw = Number(submission.submit_attempts);
    const attempts = Number.isFinite(attemptsRaw) && attemptsRaw > 0 ? attemptsRaw : 1;
    const attemptsScore = 1 / Math.sqrt(attempts);

    const timerTime = Number(submission.timer_time);
    const avgTime = Number(submission.avg_time);
    let timeScore = 0.5;
    if (Number.isFinite(timerTime) && timerTime > 0) {
      timeScore = 1 / (1 + timerTime / timeBaselineMs);
    } else if (Number.isFinite(avgTime) && avgTime > 0) {
      timeScore = 1 / (1 + avgTime / timeBaselineMs);
    }

    const dateMs = Date.parse(submission.date);
    const daysAgo = Number.isNaN(dateMs) ? 0 : Math.max(0, (now - dateMs) / (1000 * 60 * 60 * 24));
    const recencyWeight = Math.exp(-daysAgo / 30);

    const submissionFitness = guidanceScore * attemptsScore * timeScore * recencyWeight;

    for (const topic of topics) {
      if (!topicStats[topic]) {
        const difficultyStats = {};
        for (const level of difficultyLevels) {
          difficultyStats[level] = createStat();
        }
        topicStats[topic] = {
          topic,
          difficulties: difficultyStats,
          overall: createStat()
        };
      }

      const stat = topicStats[topic];
      const difficultyStat = stat.difficulties[difficulty];
      difficultyStat.totalFitness += submissionFitness;
      difficultyStat.totalWeight += recencyWeight;
      difficultyStat.submissionCount += 1;

      stat.overall.totalFitness += submissionFitness;
      stat.overall.totalWeight += recencyWeight;
      stat.overall.submissionCount += 1;

      if (!Number.isNaN(dateMs)) {
        if (!difficultyStat.lastSubmission || dateMs > Date.parse(difficultyStat.lastSubmission)) {
          difficultyStat.lastSubmission = submission.date;
        }
        if (!stat.overall.lastSubmission || dateMs > Date.parse(stat.overall.lastSubmission)) {
          stat.overall.lastSubmission = submission.date;
        }
      }
    }
  }

  const topics = Object.values(topicStats).map((stat) => {
    const buildEntry = (difficultyStat) => ({
      fitness: difficultyStat.totalWeight > 0 ? difficultyStat.totalFitness / difficultyStat.totalWeight : 0,
      submissionCount: difficultyStat.submissionCount,
      lastSubmission: difficultyStat.lastSubmission
    });

    return {
      topic: stat.topic,
      easy: buildEntry(stat.difficulties.easy),
      medium: buildEntry(stat.difficulties.medium),
      hard: buildEntry(stat.difficulties.hard),
      overallFitness: stat.overall.totalWeight > 0 ? stat.overall.totalFitness / stat.overall.totalWeight : 0,
      overallLastSubmission: stat.overall.lastSubmission,
      overallSubmissionCount: stat.overall.submissionCount
    };
  });

  topics.sort((a, b) => {
    if (b.overallFitness !== a.overallFitness) {
      return b.overallFitness - a.overallFitness;
    }
    const dateA = a.overallLastSubmission ? Date.parse(a.overallLastSubmission) : 0;
    const dateB = b.overallLastSubmission ? Date.parse(b.overallLastSubmission) : 0;
    return dateB - dateA;
  });

  return topics;
}

function stripTopicFitnessOverallFields(topics) {
  return topics.map(({ overallFitness, overallLastSubmission, overallSubmissionCount, ...rest }) => rest);
}

function buildTopicFitness(challenges, submissions) {
  return stripTopicFitnessOverallFields(buildTopicFitnessCore(challenges, submissions));
}

const SIMILARITY_TIER_WEIGHTS = {
  same: 1,
  close: 0.85,
  medium: 0.6,
  far: 0.4
};

const LANGUAGE_SIMILARITY_TIERS = {
  javascript: { typescript: 'close', python: 'medium', java: 'medium' },
  typescript: { javascript: 'close', python: 'medium', java: 'medium' },
  python: { javascript: 'medium', typescript: 'medium', java: 'far' },
  java: { javascript: 'medium', typescript: 'medium', python: 'far' }
};

function getLanguageSimilarity(sourceLanguage, targetLanguage) {
  if (sourceLanguage === targetLanguage) {
    return SIMILARITY_TIER_WEIGHTS.same;
  }
  const tier = LANGUAGE_SIMILARITY_TIERS[sourceLanguage]?.[targetLanguage] ?? 'far';
  return SIMILARITY_TIER_WEIGHTS[tier] ?? SIMILARITY_TIER_WEIGHTS.far;
}

const ONBOARDING_MIN_CARRYOVER = 0.3;
const ONBOARDING_SUBMISSION_SCALE = 8;

function getOnboardingRamp(submissionCount) {
  const count = Number.isFinite(submissionCount) ? Math.max(0, submissionCount) : 0;
  if (count <= 0) {
    return ONBOARDING_MIN_CARRYOVER;
  }
  const ramp = ONBOARDING_MIN_CARRYOVER
    + (1 - ONBOARDING_MIN_CARRYOVER) * (1 - Math.exp(-count / ONBOARDING_SUBMISSION_SCALE));
  return Math.min(1, Math.max(0, ramp));
}

function buildTopicFitnessWithTransfer(challenges, submissions, targetLanguage) {
  const normalizedTarget = normalizeLanguage(targetLanguage);
  const submissionsByLanguage = new Map();

  for (const submission of submissions) {
    const language = normalizeLanguage(submission.language);
    if (!submissionsByLanguage.has(language)) {
      submissionsByLanguage.set(language, []);
    }
    submissionsByLanguage.get(language).push(submission);
  }

  if (!submissionsByLanguage.has(normalizedTarget)) {
    submissionsByLanguage.set(normalizedTarget, []);
  }

  const topicMaps = new Map();
  const topicsByLanguage = new Map();

  for (const [language, languageSubmissions] of submissionsByLanguage.entries()) {
    const topics = buildTopicFitnessCore(challenges, languageSubmissions);
    topicsByLanguage.set(language, topics);
    const topicMap = new Map();
    for (const entry of topics) {
      topicMap.set(entry.topic, entry);
    }
    topicMaps.set(language, topicMap);
  }

  const targetTopics = topicsByLanguage.get(normalizedTarget) ?? buildTopicFitnessCore(challenges, []);
  const targetSubmissionCount = submissionsByLanguage.get(normalizedTarget)?.length ?? 0;
  const ramp = getOnboardingRamp(targetSubmissionCount);
  const otherLanguages = Array.from(topicsByLanguage.keys()).filter(
    (language) => language !== normalizedTarget
  );

  const clampFitness = (value) => Math.min(1, Math.max(0, value));

  const applyCarryover = (baseFitness, carryoverFitness) => {
    const base = Number.isFinite(baseFitness) ? baseFitness : 0;
    const carryover = Number.isFinite(carryoverFitness) ? carryoverFitness : 0;
    const blended = base + (1 - base) * ramp * carryover;
    return clampFitness(blended);
  };

  const computeCarryover = (topic, difficulty) => {
    let weightedSum = 0;
    let weightTotal = 0;

    for (const language of otherLanguages) {
      const topicMap = topicMaps.get(language);
      if (!topicMap) {
        continue;
      }
      const entry = topicMap.get(topic);
      if (!entry) {
        continue;
      }

      let fitness = 0;
      let submissionCount = 0;
      if (difficulty === 'overall') {
        fitness = entry.overallFitness ?? 0;
        submissionCount = entry.overallSubmissionCount ?? 0;
      } else {
        const detail = entry[difficulty];
        fitness = detail?.fitness ?? 0;
        submissionCount = detail?.submissionCount ?? 0;
      }

      if (!submissionCount) {
        continue;
      }

      const similarity = getLanguageSimilarity(language, normalizedTarget);
      if (similarity <= 0) {
        continue;
      }
      weightedSum += similarity * fitness;
      weightTotal += similarity;
    }

    return weightTotal > 0 ? weightedSum / weightTotal : 0;
  };

  const adjustedTopics = targetTopics.map((entry) => {
    const adjusted = {
      ...entry,
      easy: { ...entry.easy },
      medium: { ...entry.medium },
      hard: { ...entry.hard }
    };

    adjusted.easy.fitness = applyCarryover(
      adjusted.easy.fitness,
      computeCarryover(adjusted.topic, 'easy')
    );
    adjusted.medium.fitness = applyCarryover(
      adjusted.medium.fitness,
      computeCarryover(adjusted.topic, 'medium')
    );
    adjusted.hard.fitness = applyCarryover(
      adjusted.hard.fitness,
      computeCarryover(adjusted.topic, 'hard')
    );
    adjusted.overallFitness = applyCarryover(
      adjusted.overallFitness ?? 0,
      computeCarryover(adjusted.topic, 'overall')
    );

    return adjusted;
  });

  adjustedTopics.sort((a, b) => {
    if (b.overallFitness !== a.overallFitness) {
      return b.overallFitness - a.overallFitness;
    }
    const dateA = a.overallLastSubmission ? Date.parse(a.overallLastSubmission) : 0;
    const dateB = b.overallLastSubmission ? Date.parse(b.overallLastSubmission) : 0;
    return dateB - dateA;
  });

  return stripTopicFitnessOverallFields(adjustedTopics);
}

function buildFitnessSnapshotEntries(topicFitness, language) {
  const entries = [];
  const difficultyLevels = ['easy', 'medium', 'hard'];
  for (const topicEntry of topicFitness) {
    for (const difficulty of difficultyLevels) {
      const detail = topicEntry?.[difficulty];
      if (!detail) {
        continue;
      }
      entries.push({
        topic: topicEntry.topic,
        difficulty,
        fitness: detail.fitness ?? 0,
        submissionCount: detail.submissionCount ?? 0,
        lastSubmission: detail.lastSubmission ?? null,
        language
      });
    }
  }
  return entries;
}

function createFitnessSnapshot() {
  const challenges = getAllChallenges();
  const submissions = getAllSubmissions();
  const snapshotAt = new Date().toISOString();
  if (submissions.length === 0) {
    return { snapshotAt, count: 0 };
  }

  const languages = Array.from(new Set(
    submissions.map(submission => normalizeLanguage(submission.language))
  ));
  const entries = [];
  for (const language of languages) {
    const topicFitness = buildTopicFitnessWithTransfer(challenges, submissions, language);
    entries.push(...buildFitnessSnapshotEntries(topicFitness, language));
  }
  if (entries.length === 0) {
    return { snapshotAt, count: 0 };
  }
  insertFitnessSnapshot(snapshotAt, entries);
  return { snapshotAt, count: entries.length };
}

// Topic fitness summary
app.get('/api/topic-fitness', (req, res) => {
  try {
    const challenges = getAllChallenges();
    const submissions = getAllSubmissions();
    const language = normalizeLanguage(req.query.language);
    const topics = buildTopicFitnessWithTransfer(challenges, submissions, language);
    res.json({ topics, count: topics.length });
  } catch (error) {
    console.error('Get topic fitness error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load topic fitness'
    });
  }
});

// Topic fitness history
app.get('/api/topic-fitness-history', (req, res) => {
  try {
    const { topic, difficulty, since, until, limit, language: rawLanguage } = req.query || {};
    const parsedLimit = limit ? Number(limit) : undefined;
    const language = normalizeLanguage(rawLanguage);
    const history = getFitnessHistory({
      topic: typeof topic === 'string' && topic.trim() ? topic.trim() : undefined,
      difficulty: typeof difficulty === 'string' && difficulty.trim() ? difficulty.trim() : undefined,
      since: typeof since === 'string' && since.trim() ? since.trim() : undefined,
      until: typeof until === 'string' && until.trim() ? until.trim() : undefined,
      limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
      language
    });
    res.json({ history, count: history.length });
  } catch (error) {
    console.error('Get topic fitness history error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load topic fitness history'
    });
  }
});

// Retention metrics (raw data for review selection)
app.get('/api/retention-metrics', (req, res) => {
  try {
    const { refresh } = req.query || {};
    const language = normalizeLanguage(req.query.language);
    const shouldRefresh = refresh === '1' || refresh === 'true';
    let meta = null;

    if (shouldRefresh) {
      meta = refreshRetentionMetrics({ language });
    }

    const metrics = getRetentionMetrics(language);
    const computedAt = meta?.computedAt ?? (metrics?.[0]?.computed_at ?? null);

    res.json({
      metrics,
      count: metrics.length,
      computedAt,
      fitnessSnapshotAt: meta?.fitnessSnapshotAt ?? null
    });
  } catch (error) {
    console.error('Get retention metrics error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load retention metrics'
    });
  }
});

// Topic retention metrics (Codex approach)
app.get('/api/retention-metrics/topics', (req, res) => {
  try {
    const language = normalizeLanguage(req.query.language);
    const result = getTopicRetentionMetrics({ language });

    res.json({
      metrics: result.metrics,
      count: result.count,
      computedAt: result.computedAt,
      fitnessSnapshotAt: result.fitnessSnapshotAt
    });
  } catch (error) {
    console.error('Get topic retention metrics error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load topic retention metrics'
    });
  }
});

// Get single challenge metadata
app.get('/api/challenges/:id/metadata', (req, res) => {
  try {
    const challengeId = req.params.id;
    const challenge = getChallengeById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    const prerequisites = getPrerequisites(challengeId);
    const tiers = getCompanyTiers(challengeId);
    const allTree = getChallengeTree();
    const treeInfo = allTree.find(ct => ct.id === challengeId);
    
    res.json({
      id: challenge.id,
      name: challenge.name,
      folder: challenge.folder,
      test_file: challenge.test_file,
      adapter: challenge.adapter,
      difficulty: challenge.difficulty,
      topics: JSON.parse(challenge.topics || '[]'),
      prerequisites: prerequisites.map(p => ({ id: p.id, name: p.name })),
      parent_id: treeInfo?.parent_id || null,
      display_order: treeInfo?.display_order || 0,
      company_tiers: tiers.map(t => ({ tier: t.tier, required: t.required === 1 })),
      created_at: challenge.created_at,
      updated_at: challenge.updated_at
    });
  } catch (error) {
    console.error('Get challenge metadata error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load challenge metadata'
    });
  }
});

// Update challenge metadata
app.post('/api/challenges/:id/metadata', (req, res) => {
  try {
    const challengeId = req.params.id;
    const { name, difficulty, topics, parent_id, display_order, company_tiers } = req.body;
    
    // Validate challenge exists
    getChallenge(challengeId);
    
    // Update basic metadata
    if (name !== undefined || difficulty !== undefined || topics !== undefined) {
      updateChallengeMetadata(challengeId, { name, difficulty, topics });
    }
    
    // Update parent relationship
    if (parent_id !== undefined) {
      setChallengeParent(challengeId, parent_id || null, display_order || 0);
    }
    
    // Update company tiers
    if (company_tiers !== undefined && Array.isArray(company_tiers)) {
      setCompanyTiers(challengeId, company_tiers);
    }
    
    res.json({ success: true, message: 'Challenge metadata updated' });
  } catch (error) {
    console.error('Update challenge metadata error:', error);
    res.status(500).json({
      error: error.message || 'Failed to update challenge metadata'
    });
  }
});

// Register new challenge from folder
app.post('/api/challenges/register', async (req, res) => {
  try {
    const { folder, name, test_file, adapter, difficulty, topics } = req.body;
    
    if (!folder || !name || !test_file || !adapter) {
      return res.status(400).json({ error: 'folder, name, test_file, and adapter are required' });
    }
    
    const challengeId = folder;
    
    insertChallenge({
      id: challengeId,
      name,
      folder,
      test_file,
      adapter,
      difficulty: difficulty ?? null,
      topics: topics || []
    });
    
    res.json({ success: true, challenge: { id: challengeId, name, folder } });
  } catch (error) {
    console.error('Register challenge error:', error);
    res.status(500).json({
      error: error.message || 'Failed to register challenge'
    });
  }
});

// Get skill tree structure
app.get('/api/challenges/tree', (req, res) => {
  try {
    const tree = getChallengeTree();
    const challenges = tree.map(ct => ({
      id: ct.id,
      name: ct.name,
      folder: ct.folder,
      difficulty: ct.difficulty,
      topics: JSON.parse(ct.topics || '[]'),
      parent_id: ct.parent_id,
      display_order: ct.display_order
    }));
    res.json({ tree: challenges });
  } catch (error) {
    console.error('Get challenge tree error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load challenge tree'
    });
  }
});

// Get challenge graph (prerequisites) for submissions page
app.get('/api/challenges/graph', (req, res) => {
  try {
    const scope = typeof req.query.scope === 'string'
      ? req.query.scope.trim().toLowerCase()
      : 'submitted';
    const edgeType = typeof req.query.edges === 'string'
      ? req.query.edges.trim().toLowerCase()
      : 'prerequisite';
    const language = normalizeLanguage(req.query.language);

    let challenges = [];
    try {
      challenges = getAllChallenges();
    } catch (dbError) {
      challenges = Object.entries(CHALLENGES).map(([id, config]) => ({
        id,
        name: config.name,
        difficulty: null,
        topics: []
      }));
    }

    let prerequisiteEdges = [];
    if (edgeType === 'prerequisite') {
      try {
        prerequisiteEdges = getPrerequisiteEdges().map(edge => ({
          from: edge.prerequisite_id,
          to: edge.challenge_id,
          type: 'prerequisite'
        }));
      } catch {
        prerequisiteEdges = [];
      }
    }

    let submissionCounts = new Map();
    try {
      const rows = getSubmissionCountsByChallenge(language);
      submissionCounts = new Map(rows.map(row => [row.challenge_id, row.count]));
    } catch {
      submissionCounts = new Map();
    }

    const submittedIds = new Set(
      Array.from(submissionCounts.entries())
        .filter(([, count]) => Number(count) > 0)
        .map(([challengeId]) => challengeId)
    );

    let includedIds = new Set();
    if (scope === 'all') {
      includedIds = new Set(challenges.map((challenge) => challenge.id));
    } else if (scope === 'submitted') {
      includedIds = new Set(submittedIds);
      const prereqMap = new Map();
      for (const edge of prerequisiteEdges) {
        if (!prereqMap.has(edge.to)) {
          prereqMap.set(edge.to, []);
        }
        prereqMap.get(edge.to).push(edge.from);
      }
      const stack = Array.from(submittedIds);
      while (stack.length > 0) {
        const current = stack.pop();
        const prereqs = prereqMap.get(current) || [];
        for (const prereqId of prereqs) {
          if (!includedIds.has(prereqId)) {
            includedIds.add(prereqId);
            stack.push(prereqId);
          }
        }
      }
    }

    const nodes = challenges
      .filter((challenge) => includedIds.has(challenge.id))
      .map((challenge) => ({
        id: challenge.id,
        name: challenge.name,
        difficulty: challenge.difficulty ?? 'unknown',
        topics: parseTopicsValue(challenge.topics),
        hasSubmission: submissionCounts.has(challenge.id),
        submissionCount: submissionCounts.get(challenge.id) ?? 0
      }));

    const edges = prerequisiteEdges.filter(
      (edge) => includedIds.has(edge.from) && includedIds.has(edge.to)
    );

    res.json({ nodes, edges });
  } catch (error) {
    console.error('Get challenge graph error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load challenge graph'
    });
  }
});

// Get prerequisites for a challenge
app.get('/api/challenges/:id/prerequisites', (req, res) => {
  try {
    const challengeId = req.params.id;
    getChallenge(challengeId); // Validate exists
    
    const prerequisites = getPrerequisites(challengeId);
    res.json({
      challenge_id: challengeId,
      prerequisites: prerequisites.map(p => ({ id: p.id, name: p.name }))
    });
  } catch (error) {
    console.error('Get prerequisites error:', error);
    res.status(500).json({
      error: error.message || 'Failed to load prerequisites'
    });
  }
});

// Set prerequisites for a challenge
app.post('/api/challenges/:id/prerequisites', (req, res) => {
  try {
    const challengeId = req.params.id;
    const { prerequisite_ids } = req.body;
    
    if (!Array.isArray(prerequisite_ids)) {
      return res.status(400).json({ error: 'prerequisite_ids must be an array' });
    }
    
    getChallenge(challengeId); // Validate challenge exists
    
    // Validate all prerequisites exist
    for (const prereqId of prerequisite_ids) {
      getChallenge(prereqId);
    }
    
    setPrerequisites(challengeId, prerequisite_ids);
    res.json({ success: true, message: 'Prerequisites updated' });
  } catch (error) {
    console.error('Set prerequisites error:', error);
    res.status(500).json({
      error: error.message || 'Failed to set prerequisites'
    });
  }
});

// Auto-discover challenges from file system
async function discoverChallenges() {
  try {
    const dataDir = join(__dirname, '../../data');
    const folders = await readdir(dataDir);

    const folderToChallengeId = (folder) => {
      if (folder === 'longest_substring_without_repeating_characters') {
        return 'longestSubstringWithoutRepeatingCharacters';
      }
      return folder;
    };
    
    for (const folder of folders) {
      const folderPath = join(dataDir, folder);
      
      try {
        const stats = await stat(folderPath);
        if (!stats.isDirectory()) {
          continue;
        }
        
        // Check if challenge folder has template.java
        const templatePath = join(folderPath, 'template.java');
        try {
          await stat(templatePath);
          
          const challengeId = folderToChallengeId(folder);

          // Check if challenge already exists in database
          const existing = getChallengeById(challengeId);
          if (existing) {
            continue; // Already registered
          }
          
          // Try to find matching entries in CHALLENGES object
          const challengeConfig = CHALLENGES[folder];
          if (challengeConfig) {
            // Register from CHALLENGES object
            insertChallenge({
              id: challengeId,
              name: challengeConfig.name,
              folder: challengeConfig.folder,
              test_file: challengeConfig.testFile,
              adapter: challengeConfig.adapter,
              difficulty: null,
              topics: []
            });
            console.log(`Auto-registered challenge: ${challengeId}`);
          }
        } catch {
          // No template.java, skip
          continue;
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    console.warn('Error during challenge discovery:', error.message);
  }
}

// Only start server if not in test environment
// In test environment, we export the app for supertest to use
if (process.env.NODE_ENV !== 'test') {
  // Initialize database
  initDatabase();
  const startServer = () => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  };

  // Auto-discover challenges on startup
  discoverChallenges().then(() => {
    // Run one-time cleanup of old temp files on server startup
    return cleanupOldTempFiles();
  }).then(() => {
    startServer();
  }).catch(err => {
    console.error('Error during startup:', err);
    // Still start the server even if discovery/cleanup fails
    startServer();
  });
}

export const __testables = {
  normalizeLanguage,
  normalizeDifficulty,
  parseTopicsValue,
  normalizeChallengeInput,
  normalizeSubmissionInput,
  normalizeSubmissionsList,
  inferLanguage,
  buildFitnessEntriesFromTopicFitness,
  computeTopicFitnessScore,
  normalizeValues,
  buildTopicPriorityMap,
  stripHtml,
  normalizeChallengeName,
  getTechBarDescriptionText,
  evaluateTechBarLabel,
  updateTechBarInFile,
  getLanguageAdapterPath,
  getTemplateFilename,
  buildProgressSummary,
  buildTopicFitnessCore,
  buildTopicFitnessWithTransfer,
  buildFitnessSnapshotEntries,
  getLanguageSimilarity,
  getOnboardingRamp
};
