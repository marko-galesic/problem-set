// First Non-Repeating Char test suite
//
// Test cases for firstNonRepeatingChar(String s)

export const runTests = [
  {
    "id": 1,
    "name": "Unique at start",
    "input": "s = \"leetcode\"",
    "s": "leetcode",
    "expected": 0
  },
  {
    "id": 2,
    "name": "Unique in middle",
    "input": "s = \"loveleetcode\"",
    "s": "loveleetcode",
    "expected": 2
  },
  {
    "id": 3,
    "name": "No unique",
    "input": "s = \"aabb\"",
    "s": "aabb",
    "expected": -1
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Unique later",
      "input": "s = \"aabc\"",
      "s": "aabc",
      "expected": 2
    },
    {
      "id": 5,
      "name": "Empty string",
      "input": "s = \"\"",
      "s": "",
      "expected": -1
    }
];
