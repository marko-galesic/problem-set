// Find All Anagrams in a String test suite
//
// Test cases for findAnagrams(s, p) method
// Returns int[]

export const runTests = [
  {
    "id": 1,
    "name": "Two matches",
    "input": "s = \"cbaebabacd\", p = \"abc\"",
    "s": "cbaebabacd",
    "p": "abc",
    "expected": [
      0,
      6
    ]
  },
  {
    "id": 2,
    "name": "Overlapping matches",
    "input": "s = \"abab\", p = \"ab\"",
    "s": "abab",
    "p": "ab",
    "expected": [
      0,
      1,
      2
    ]
  },
  {
    "id": 3,
    "name": "No matches",
    "input": "s = \"af\", p = \"be\"",
    "s": "af",
    "p": "be",
    "expected": []
  },
  {
    "id": 4,
    "name": "Single match at end",
    "input": "s = \"baa\", p = \"aa\"",
    "s": "baa",
    "p": "aa",
    "expected": [
      1
    ]
  }
];

export const submitTests = [
  ...runTests
];
