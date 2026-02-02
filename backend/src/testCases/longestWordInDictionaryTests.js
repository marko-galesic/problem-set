// Longest Word in Dictionary test suite
//
// Test cases for longestWord(String[] words) method
// Returns String

export const runTests = [
  {
    id: 1,
    name: "Buildable chain",
    input: 'words = ["w","wo","wor","worl","world"]',
    words: ["w", "wo", "wor", "worl", "world"],
    expected: "world"
  },
  {
    id: 2,
    name: "Tie broken lexicographically",
    input: 'words = ["a","ap","app","appl","apple","apply"]',
    words: ["a", "ap", "app", "appl", "apple", "apply"],
    expected: "apple"
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Missing prefix",
    input: 'words = ["b","ba","bac","baca","ban"]',
    words: ["b", "ba", "bac", "baca", "ban"],
    expected: "baca"
  },
  {
    id: 4,
    name: "No buildable words",
    input: 'words = ["abc","abcd"]',
    words: ["abc", "abcd"],
    expected: ""
  }
];
