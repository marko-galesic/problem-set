// Count Palindromic Substrings test suite
//
// Test cases for countPalindromicSubstrings method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "No repeats",
    "input": "s = \"abc\"",
    "s": "abc",
    "expected": 3
  },
  {
    "id": 2,
    "name": "All same",
    "input": "s = \"aaa\"",
    "s": "aaa",
    "expected": 6
  },
  {
    "id": 3,
    "name": "Odd palindromes",
    "input": "s = \"ababa\"",
    "s": "ababa",
    "expected": 9
  }
];

export const submitTests = [
  ...runTests
];
