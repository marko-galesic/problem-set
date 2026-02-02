// Remove Adjacent K Duplicates test suite
//
// Test cases for removeAdjacentKDuplicates method
// Returns string

export const runTests = [
  {
    "id": 1,
    "name": "Multiple removals",
    "input": "s = \"deeedbbcccbdaa\", k = 3",
    "s": "deeedbbcccbdaa",
    "k": 3,
    "expected": "aa"
  },
  {
    "id": 2,
    "name": "Repeated pairs",
    "input": "s = \"pbbcggttciiippooaais\", k = 2",
    "s": "pbbcggttciiippooaais",
    "k": 2,
    "expected": "ps"
  },
  {
    "id": 3,
    "name": "No changes",
    "input": "s = \"abcd\", k = 2",
    "s": "abcd",
    "k": 2,
    "expected": "abcd"
  }
];

export const submitTests = [
  ...runTests
];
