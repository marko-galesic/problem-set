// Prefix and Suffix Search test suite
//
// Test cases for prefixSuffixSearch(String[] words, String[] queries) method
// Returns int[]

export const runTests = [
  {
    id: 1,
    name: "Basic queries",
    input: 'words = ["apple","apply","ape","apex"], queries = ["ap|le","ap|ly","a|x","ap|"]',
    words: ["apple", "apply", "ape", "apex"],
    queries: ["ap|le", "ap|ly", "a|x", "ap|"],
    expected: [0, 1, 3, 3]
  },
  {
    id: 2,
    name: "Empty prefix",
    input: 'words = ["cat","bat","rat"], queries = ["|at","|t","|z"]',
    words: ["cat", "bat", "rat"],
    queries: ["|at", "|t", "|z"],
    expected: [2, 2, -1]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "No matches",
    input: 'words = ["hello","world"], queries = ["he|z","x|"]',
    words: ["hello", "world"],
    queries: ["he|z", "x|"],
    expected: [-1, -1]
  },
  {
    id: 4,
    name: "Duplicate words",
    input: 'words = ["a","a","ab"], queries = ["a|","a|b"]',
    words: ["a", "a", "ab"],
    queries: ["a|", "a|b"],
    expected: [2, 2]
  }
];
