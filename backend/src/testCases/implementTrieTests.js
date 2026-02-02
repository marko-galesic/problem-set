// Implement Trie test suite
//
// Test cases for trieOps(String[] ops, String[] words) method
// Returns int[] results for search/startsWith operations

export const runTests = [
  {
    id: 1,
    name: "Basic insert/search/startsWith",
    input: 'ops = ["insert","insert","search","search","startsWith","startsWith"], words = ["apple","app","app","ap","app","apl"]',
    ops: ["insert", "insert", "search", "search", "startsWith", "startsWith"],
    words: ["apple", "app", "app", "ap", "app", "apl"],
    expected: [1, 0, 1, 0]
  },
  {
    id: 2,
    name: "Search before and after insert",
    input: 'ops = ["search","insert","search","startsWith"], words = ["hi","hi","hi","h"]',
    ops: ["search", "insert", "search", "startsWith"],
    words: ["hi", "hi", "hi", "h"],
    expected: [0, 1, 1]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Overlapping prefixes",
    input: 'ops = ["insert","insert","startsWith","search"], words = ["a","ab","a","ab"]',
    ops: ["insert", "insert", "startsWith", "search"],
    words: ["a", "ab", "a", "ab"],
    expected: [1, 1]
  },
  {
    id: 4,
    name: "Longer word only",
    input: 'ops = ["insert","search","startsWith"], words = ["banana","ban","ba"]',
    ops: ["insert", "search", "startsWith"],
    words: ["banana", "ban", "ba"],
    expected: [0, 1]
  }
];
