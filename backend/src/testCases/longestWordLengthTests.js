// Longest Word Length test suite
//
// Test cases for longestWordLength(String[] words) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "words = [\"a\", \"bb\", \"ccc\"]",
    words: ["a", "bb", "ccc"],
    expected: 3
  },
  {
    id: 2,
    name: "Case 2",
    input: "words = []",
    words: [],
    expected: 0
  },
  {
    id: 3,
    name: "Case 3",
    input: "words = [\"hello\", \"world\"]",
    words: ["hello", "world"],
    expected: 5
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "words = [\"one\"]",
    words: ["one"],
    expected: 3
  },
  {
    id: 5,
    name: "Case 5",
    input: "words = [\"a\", \"ab\", \"abc\", \"abcd\"]",
    words: ["a", "ab", "abc", "abcd"],
    expected: 4
  }
];
