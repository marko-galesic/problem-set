// Longest Palindrome Length test suite
//
// Test cases for longestPalindromeLength method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Mixed counts",
    "input": "s = \"abccccdd\"",
    "s": "abccccdd",
    "expected": 7
  },
  {
    "id": 2,
    "name": "Single char",
    "input": "s = \"a\"",
    "s": "a",
    "expected": 1
  },
  {
    "id": 3,
    "name": "Two same",
    "input": "s = \"bb\"",
    "s": "bb",
    "expected": 2
  },
  {
    "id": 4,
    "name": "All unique",
    "input": "s = \"abc\"",
    "s": "abc",
    "expected": 1
  }
];

export const submitTests = [
  ...runTests
];
