// Decode String test suite
//
// Test cases for decodeString(s) method
// Returns String

export const runTests = [
  {
    "id": 1,
    "name": "Simple example",
    "input": "s = \"3[a]2[bc]\"",
    "s": "3[a]2[bc]",
    "expected": "aaabcbc"
  },
  {
    "id": 2,
    "name": "Nested example",
    "input": "s = \"3[a2[c]]\"",
    "s": "3[a2[c]]",
    "expected": "accaccacc"
  },
  {
    "id": 3,
    "name": "Multiple segments",
    "input": "s = \"2[abc]3[cd]ef\"",
    "s": "2[abc]3[cd]ef",
    "expected": "abcabccdcdcdef"
  },
  {
    "id": 4,
    "name": "Two-digit count",
    "input": "s = \"10[a]\"",
    "s": "10[a]",
    "expected": "aaaaaaaaaa"
  }
];

export const submitTests = [
  ...runTests
];
