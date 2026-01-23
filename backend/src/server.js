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
import { initDatabase } from './db/database.js';
import {
  getChallengeById,
  getAllChallenges,
  insertChallenge,
  updateChallengeMetadata,
  getPrerequisites,
  setPrerequisites,
  getChallengeTree,
  setChallengeParent,
  getCompanyTiers,
  setCompanyTiers,
  getSubmissions as getSubmissionsFromDb,
  getAllSubmissions,
  getSubmissionById as getSubmissionByIdFromDb,
  insertSubmission as insertSubmissionToDb,
  deleteSubmission as deleteSubmissionFromDb,
  updateSubmission as updateSubmissionInDb,
  insertFitnessSnapshot,
  getFitnessHistory
} from './db/queries.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default challenge ID (configurable)
export const DEFAULT_CHALLENGE = 'two_sum';

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
    adapter: './adapters/twoSumAdapter.js'
  },
  contains_duplicate: {
    name: 'Contains Duplicate',
    folder: 'contains_duplicate',
    testFile: './testCases/containsDuplicateTests.js',
    adapter: './adapters/containsDuplicateAdapter.js'
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
    adapter: './adapters/numberOfIslandsAdapter.js'
  },
  valid_parentheses: {
    name: 'Valid Parentheses',
    folder: 'valid_parentheses',
    testFile: './testCases/validParenthesesTests.js',
    adapter: './adapters/validParenthesesAdapter.js'
  },
  valid_anagram: {
    name: 'Valid Anagram',
    folder: 'valid_anagram',
    testFile: './testCases/validAnagramTests.js',
    adapter: './adapters/validAnagramAdapter.js'
  },
  valid_palindrome: {
    name: 'Valid Palindrome',
    folder: 'valid_palindrome',
    testFile: './testCases/validPalindromeTests.js',
    adapter: './adapters/validPalindromeAdapter.js'
  },
  valid_palindrome_ii: {
    name: 'Valid Palindrome II',
    folder: 'valid_palindrome_ii',
    testFile: './testCases/validPalindromeIiTests.js',
    adapter: './adapters/validPalindromeIiAdapter.js'
  },
  permutation_in_string: {
    name: 'Permutation in String',
    folder: 'permutation_in_string',
    testFile: './testCases/permutationInStringTests.js',
    adapter: './adapters/permutationInStringAdapter.js'
  },
  is_subsequence: {
    name: 'Is Subsequence',
    folder: 'is_subsequence',
    testFile: './testCases/isSubsequenceTests.js',
    adapter: './adapters/isSubsequenceAdapter.js'
  },
  to_lower_case: {
    name: 'To Lower Case',
    folder: 'to_lower_case',
    testFile: './testCases/toLowerCaseTests.js',
    adapter: './adapters/toLowerCaseAdapter.js'
  },
  rotting_oranges: {
    name: 'Rotting Oranges',
    folder: 'rotting_oranges',
    testFile: './testCases/rottingOrangesTests.js',
    adapter: './adapters/rottingOrangesAdapter.js'
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
  longest_substring_without_repeating_characters: {
    name: 'Longest Substring Without Repeating Characters',
    folder: 'longest_substring_without_repeating_characters',
    testFile: './testCases/longestSubstringWithoutRepeatingCharactersTests.js',
    adapter: './adapters/longestSubstringWithoutRepeatingCharactersAdapter.js'
  },
  longest_repeating_character_replacement: {
    name: 'Longest Repeating Character Replacement',
    folder: 'longest_repeating_character_replacement',
    testFile: './testCases/longestRepeatingCharacterReplacementTests.js',
    adapter: './adapters/longestRepeatingCharacterReplacementAdapter.js'
  },
  best_time_to_buy_and_sell_stock: {
    name: 'Best Time to Buy and Sell Stock',
    folder: 'best_time_to_buy_and_sell_stock',
    testFile: './testCases/bestTimeToBuyAndSellStockTests.js',
    adapter: './adapters/bestTimeToBuyAndSellStockAdapter.js'
  },
  remove_duplicates_from_sorted_array: {
    name: 'Remove Duplicates from Sorted Array',
    folder: 'remove_duplicates_from_sorted_array',
    testFile: './testCases/removeDuplicatesFromSortedArrayTests.js',
    adapter: './adapters/removeDuplicatesFromSortedArrayAdapter.js'
  },
  remove_element: {
    name: 'Remove Element',
    folder: 'remove_element',
    testFile: './testCases/removeElementTests.js',
    adapter: './adapters/removeElementAdapter.js'
  },
  maximum_average_subarray_i: {
    name: 'Maximum Average Subarray I',
    folder: 'maximum_average_subarray_i',
    testFile: './testCases/maximumAverageSubarrayITests.js',
    adapter: './adapters/maximumAverageSubarrayIAdapter.js'
  },
  coin_change: {
    name: 'Coin Change',
    folder: 'coin_change',
    testFile: './testCases/coinChangeTests.js',
    adapter: './adapters/coinChangeAdapter.js'
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
    adapter: './adapters/binarySearchAdapter.js'
  },
  fibonacci_number: {
    name: 'Fibonacci Number',
    folder: 'fibonacci_number',
    testFile: './testCases/fibonacciNumberTests.js',
    adapter: './adapters/fibonacciNumberAdapter.js'
  },
  move_zeroes: {
    name: 'Move Zeroes',
    folder: 'move_zeroes',
    testFile: './testCases/moveZeroesTests.js',
    adapter: './adapters/moveZeroesAdapter.js'
  },
  reverse_string: {
    name: 'Reverse String',
    folder: 'reverse_string',
    testFile: './testCases/reverseStringTests.js',
    adapter: './adapters/reverseStringAdapter.js'
  },
  first_unique_character: {
    name: 'First Unique Character',
    folder: 'first_unique_character',
    testFile: './testCases/firstUniqueCharacterTests.js',
    adapter: './adapters/firstUniqueCharacterAdapter.js'
  },
  majority_element: {
    name: 'Majority Element',
    folder: 'majority_element',
    testFile: './testCases/majorityElementTests.js',
    adapter: './adapters/majorityElementAdapter.js'
  },
  maximum_subarray: {
    name: 'Maximum Subarray',
    folder: 'maximum_subarray',
    testFile: './testCases/maximumSubarrayTests.js',
    adapter: './adapters/maximumSubarrayAdapter.js'
  },
  valid_mountain_array: {
    name: 'Valid Mountain Array',
    folder: 'valid_mountain_array',
    testFile: './testCases/validMountainArrayTests.js',
    adapter: './adapters/validMountainArrayAdapter.js'
  },
  single_number: {
    name: 'Single Number',
    folder: 'single_number',
    testFile: './testCases/singleNumberTests.js',
    adapter: './adapters/singleNumberAdapter.js'
  },
  climbing_stairs: {
    name: 'Climbing Stairs',
    folder: 'climbing_stairs',
    testFile: './testCases/climbingStairsTests.js',
    adapter: './adapters/climbingStairsAdapter.js'
  },
  two_sum_ii_input_sorted: {
    name: 'Two Sum II (Input Sorted)',
    folder: 'two_sum_ii_input_sorted',
    testFile: './testCases/twoSumIiInputSortedTests.js',
    adapter: './adapters/twoSumIiInputSortedAdapter.js'
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
    adapter: './adapters/fourSumAdapter.js'
  },
  container_with_most_water: {
    name: 'Container With Most Water',
    folder: 'container_with_most_water',
    testFile: './testCases/containerWithMostWaterTests.js',
    adapter: './adapters/containerWithMostWaterAdapter.js'
  },
  trapping_rain_water: {
    name: 'Trapping Rain Water',
    folder: 'trapping_rain_water',
    testFile: './testCases/trappingRainWaterTests.js',
    adapter: './adapters/trappingRainWaterAdapter.js'
  },
  product_of_array_except_self: {
    name: 'Product of Array Except Self',
    folder: 'product_of_array_except_self',
    testFile: './testCases/productOfArrayExceptSelfTests.js',
    adapter: './adapters/productOfArrayExceptSelfAdapter.js'
  },
  find_minimum_in_rotated_sorted_array: {
    name: 'Find Minimum in Rotated Sorted Array',
    folder: 'find_minimum_in_rotated_sorted_array',
    testFile: './testCases/findMinimumInRotatedSortedArrayTests.js',
    adapter: './adapters/findMinimumInRotatedSortedArrayAdapter.js'
  },
  search_in_rotated_sorted_array: {
    name: 'Search in Rotated Sorted Array',
    folder: 'search_in_rotated_sorted_array',
    testFile: './testCases/searchInRotatedSortedArrayTests.js',
    adapter: './adapters/searchInRotatedSortedArrayAdapter.js'
  },
  merge_intervals: {
    name: 'Merge Intervals',
    folder: 'merge_intervals',
    testFile: './testCases/mergeIntervalsTests.js',
    adapter: './adapters/mergeIntervalsAdapter.js'
  },
  insert_interval: {
    name: 'Insert Interval',
    folder: 'insert_interval',
    testFile: './testCases/insertIntervalTests.js',
    adapter: './adapters/insertIntervalAdapter.js'
  },
  non_overlapping_intervals: {
    name: 'Non-overlapping Intervals',
    folder: 'non_overlapping_intervals',
    testFile: './testCases/nonOverlappingIntervalsTests.js',
    adapter: './adapters/nonOverlappingIntervalsAdapter.js'
  },
  meeting_rooms: {
    name: 'Meeting Rooms',
    folder: 'meeting_rooms',
    testFile: './testCases/meetingRoomsTests.js',
    adapter: './adapters/meetingRoomsAdapter.js'
  },
  meeting_rooms_ii: {
    name: 'Meeting Rooms II',
    folder: 'meeting_rooms_ii',
    testFile: './testCases/meetingRoomsIiTests.js',
    adapter: './adapters/meetingRoomsIiAdapter.js'
  },
  spiral_matrix: {
    name: 'Spiral Matrix',
    folder: 'spiral_matrix',
    testFile: './testCases/spiralMatrixTests.js',
    adapter: './adapters/spiralMatrixAdapter.js'
  },
  rotate_image: {
    name: 'Rotate Image',
    folder: 'rotate_image',
    testFile: './testCases/rotateImageTests.js',
    adapter: './adapters/rotateImageAdapter.js'
  },
  set_matrix_zeroes: {
    name: 'Set Matrix Zeroes',
    folder: 'set_matrix_zeroes',
    testFile: './testCases/setMatrixZeroesTests.js',
    adapter: './adapters/setMatrixZeroesAdapter.js'
  },
  word_search: {
    name: 'Word Search',
    folder: 'word_search',
    testFile: './testCases/wordSearchTests.js',
    adapter: './adapters/wordSearchAdapter.js'
  },
  letter_combinations_of_a_phone_number: {
    name: 'Letter Combinations of a Phone Number',
    folder: 'letter_combinations_of_a_phone_number',
    testFile: './testCases/letterCombinationsOfAPhoneNumberTests.js',
    adapter: './adapters/letterCombinationsOfAPhoneNumberAdapter.js'
  },
  generate_parentheses: {
    name: 'Generate Parentheses',
    folder: 'generate_parentheses',
    testFile: './testCases/generateParenthesesTests.js',
    adapter: './adapters/generateParenthesesAdapter.js'
  },
  combination_sum: {
    name: 'Combination Sum',
    folder: 'combination_sum',
    testFile: './testCases/combinationSumTests.js',
    adapter: './adapters/combinationSumAdapter.js'
  },
  combination_sum_ii: {
    name: 'Combination Sum II',
    folder: 'combination_sum_ii',
    testFile: './testCases/combinationSumIiTests.js',
    adapter: './adapters/combinationSumIiAdapter.js'
  },
  permutations: {
    name: 'Permutations',
    folder: 'permutations',
    testFile: './testCases/permutationsTests.js',
    adapter: './adapters/permutationsAdapter.js'
  },
  subsets: {
    name: 'Subsets',
    folder: 'subsets',
    testFile: './testCases/subsetsTests.js',
    adapter: './adapters/subsetsAdapter.js'
  },
  subsets_ii: {
    name: 'Subsets II',
    folder: 'subsets_ii',
    testFile: './testCases/subsetsIiTests.js',
    adapter: './adapters/subsetsIiAdapter.js'
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
    adapter: './adapters/longestCommonPrefixAdapter.js'
  },
  valid_sudoku: {
    name: 'Valid Sudoku',
    folder: 'valid_sudoku',
    testFile: './testCases/validSudokuTests.js',
    adapter: './adapters/validSudokuAdapter.js'
  },
  sudoku_solver: {
    name: 'Sudoku Solver',
    folder: 'sudoku_solver',
    testFile: './testCases/sudokuSolverTests.js',
    adapter: './adapters/sudokuSolverAdapter.js'
  },
  kth_largest_element_in_an_array: {
    name: 'Kth Largest Element in an Array',
    folder: 'kth_largest_element_in_an_array',
    testFile: './testCases/kthLargestElementInAnArrayTests.js',
    adapter: './adapters/kthLargestElementInAnArrayAdapter.js'
  },
  top_k_frequent_words: {
    name: 'Top K Frequent Words',
    folder: 'top_k_frequent_words',
    testFile: './testCases/topKFrequentWordsTests.js',
    adapter: './adapters/topKFrequentWordsAdapter.js'
  },
  sliding_window_maximum: {
    name: 'Sliding Window Maximum',
    folder: 'sliding_window_maximum',
    testFile: './testCases/slidingWindowMaximumTests.js',
    adapter: './adapters/slidingWindowMaximumAdapter.js'
  },
  minimum_window_substring: {
    name: 'Minimum Window Substring',
    folder: 'minimum_window_substring',
    testFile: './testCases/minimumWindowSubstringTests.js',
    adapter: './adapters/minimumWindowSubstringAdapter.js'
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
};

// Helper function to get challenge config
// Tries database first, falls back to CHALLENGES object
function getChallenge(challengeId) {
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:getChallenge:start',message:'getChallenge start',data:{challengeId},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
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
      const testFilePath = join(__dirname, candidate.testFile || '');
      const adapterPath = join(__dirname, candidate.adapter || '');
      if (existsSync(testFilePath) && existsSync(adapterPath)) {
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:getChallenge:db',message:'getChallenge resolved from db',data:{challengeId,testFile:candidate.testFile,adapter:candidate.adapter},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
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
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:getChallenge:config',message:'getChallenge resolved from config',data:{challengeId,testFile:challenge.testFile,adapter:challenge.adapter},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'G'})}).catch(()=>{});
  // #endregion
  return challenge;
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

function getLanguageAdapterPath(challenge, language) {
  if (language === 'python' && challenge.adapter.startsWith('./adapters/')) {
    return challenge.adapter.replace('./adapters/', './adapters/python/');
  }
  if (language === 'javascript' && challenge.adapter.startsWith('./adapters/')) {
    return challenge.adapter.replace('./adapters/', './adapters/javascript/');
  }
  if (language === 'typescript' && challenge.adapter.startsWith('./adapters/')) {
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
  const testModule = await import(challenge.testFile);
  let runTests = testModule.runTests || [];
  let submitTests = testModule.submitTests || [];
  
  // Load adapter to check if it has preprocessing
  const adapterPath = getLanguageAdapterPath(challenge, language);
  const adapter = await loadAdapter(adapterPath);
  
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
    const templatePath = join(__dirname, '../../data', challenge.folder, getTemplateFilename(language));
    const templateContent = await readFile(templatePath, 'utf8');
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
    const descriptionPath = join(__dirname, '../../data', challenge.folder, 'description.html');
    const descriptionContent = await readFile(descriptionPath, 'utf8');
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
    const adapterPath = getLanguageAdapterPath(challenge, language);
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
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:test-cases:run',message:'normalized run test input',data:{challengeId,language,testId:test.id,inputType:typeof inputValue,usedProvidedInput:test.input !== undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'K'})}).catch(()=>{});
      // #endregion
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
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:test-cases:submit',message:'normalized submit test input',data:{challengeId,language,testId:test.id,inputType:typeof inputValue,usedProvidedInput:test.input !== undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'K'})}).catch(()=>{});
      // #endregion
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

    const { runTests, submitTests } = await loadTestCases(challenge, language);
    const adapterPath = getLanguageAdapterPath(getChallenge(challenge), language);
    const adapter = await loadAdapter(adapterPath);

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

    const { submitTests } = await loadTestCases(challenge, language);
    const adapterPath = getLanguageAdapterPath(getChallenge(challenge), language);
    const adapter = await loadAdapter(adapterPath);

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
    const { submissions, challenges } = req.body || {};

    if (!Array.isArray(submissions)) {
      return res.status(400).json({ error: 'submissions must be an array' });
    }

    const client = getOpenAiClient();
    if (!client) {
      return res.status(503).json({ error: 'Missing OPENAI_API_KEY' });
    }

    const model = 'gpt-5';
    const systemPrompt = [
      'You are a coach recommending the next LeetCode challenge.',
      'Use the submission history to pick a helpful next problem.',
      'Guidance labels: Independent = no help, Minor = small hints, Guided = significant AI guidance.',
      'Weigh Independent and Minor submissions more than Guided when recommending.',
      'Topic fitness is a 0-1 score per topic and difficulty (easy, medium, hard) with fields: fitness, submissionCount, lastSubmission.',
      'Prioritize lower-fitness difficulties; if easy is strong but medium/hard are weak, ramp difficulty gradually.',
      'Use your judgment to decide which techniques are basic vs advanced for this user.',
      'Ensure basic techniques reach at least 0.75 fitness before adding or mixing in other topics.',
      'Return only JSON with keys: name, difficulty, explanation.',
      'The explanation should be a single string combining justification and rationale.'
    ].join(' ');

    const topicFitness = buildTopicFitness(
      getAllChallenges(),
      getAllSubmissions()
    );

    const cutoffMs = Date.now() - 30 * 24 * 60 * 60 * 1000;

    function isRecentSubmission(submission) {
      if (!submission || typeof submission !== 'object') {
        return false;
      }
      if (!submission.date) {
        return true;
      }
      const submittedAt = Date.parse(submission.date);
      if (Number.isNaN(submittedAt)) {
        return true;
      }
      return submittedAt >= cutoffMs;
    }

    function formatTimerTime(ms) {
      if (ms === null || ms === undefined) {
        return null;
      }
      const numeric = Number(ms);
      if (!Number.isFinite(numeric)) {
        return null;
      }
      if (numeric < 0) {
        return 'Untracked';
      }
      const totalSeconds = Math.floor(numeric / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    const sanitizedSubmissions = submissions
      .filter(isRecentSubmission)
      .map((submission) => {
      if (!submission || typeof submission !== 'object') {
        return submission;
      }
      const {
        solution,
        id,
        techBarStatus,
        techBarLabel,
        ...rest
      } = submission;
      const formattedTimerTime = formatTimerTime(rest.timerTime);
      const sanitized = { ...rest };
      if (formattedTimerTime !== null) {
        sanitized.timerTime = formattedTimerTime;
      } else {
        delete sanitized.timerTime;
      }
      return sanitized;
    });

    const userPrompt = [
      'Submission history:',
      JSON.stringify(sanitizedSubmissions),
      'Topic fitness per topic (0 = not fit, 1 = 100% fit):',
      JSON.stringify(topicFitness),
      'Known challenge metadata (may be empty):',
      JSON.stringify(Array.isArray(challenges) ? challenges : [])
    ].join('\n\n');

    const response = await client.chat.completions.create({
      model,
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

    const name = typeof parsed?.name === 'string' ? parsed.name.trim() : '';
    const difficulty = typeof parsed?.difficulty === 'string' ? parsed.difficulty.trim() : '';
    const explanation = typeof parsed?.explanation === 'string' ? parsed.explanation.trim() : '';

    if (!name || !difficulty || !explanation) {
      return res.status(502).json({ error: 'OpenAI response missing required fields' });
    }

    return res.json({
      name,
      difficulty,
      explanation,
      systemPrompt,
      userPrompt
    });
  } catch (error) {
    console.error('Recommend next challenge error:', error);
    return res.status(500).json({ error: error.message || 'Failed to recommend challenge' });
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
      'Use at most one short paragraph or a short bullet list.'
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

function buildTopicFitness(challenges, submissions) {
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
      overallLastSubmission: stat.overall.lastSubmission
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

  return topics.map(({ overallFitness, overallLastSubmission, ...rest }) => rest);
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
    const languageSubmissions = submissions.filter(
      submission => normalizeLanguage(submission.language) === language
    );
    const topicFitness = buildTopicFitness(challenges, languageSubmissions);
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
    const filteredSubmissions = submissions.filter(
      submission => normalizeLanguage(submission.language) === language
    );
    const topics = buildTopicFitness(challenges, filteredSubmissions);
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
  
  // Auto-discover challenges on startup
  discoverChallenges().then(() => {
    // Run one-time cleanup of old temp files on server startup
    return cleanupOldTempFiles();
  }).then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Error during startup:', err);
    // Still start the server even if discovery/cleanup fails
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  });
}
