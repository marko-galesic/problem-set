// Longest Substring with K Distinct test suite
//
// Test cases for longestSubstringKDistinct method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Simple example",
    "input": "s = \"eceba\", k = 2",
    "s": "eceba",
    "k": 2,
    "expected": 3
  },
  {
    "id": 2,
    "name": "All same",
    "input": "s = \"aa\", k = 1",
    "s": "aa",
    "k": 1,
    "expected": 2
  },
  {
    "id": 3,
    "name": "Two distinct",
    "input": "s = \"aabbcc\", k = 2",
    "s": "aabbcc",
    "k": 2,
    "expected": 4
  },
  {
    "id": 4,
    "name": "Empty string",
    "input": "s = \"\", k = 3",
    "s": "",
    "k": 3,
    "expected": 0
  }
];

export const submitTests = [
  ...runTests
];
