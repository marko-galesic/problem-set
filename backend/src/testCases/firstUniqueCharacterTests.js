// First Unique Character test suite
//
// Test cases for firstUniqChar(String s) method
// Returns int: index of the first non-repeating character, or -1

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: 's = "leetcode"',
    s: "leetcode",
    expected: 0
  },
  {
    id: 2,
    name: "Unique in middle",
    input: 's = "loveleetcode"',
    s: "loveleetcode",
    expected: 2
  },
  {
    id: 3,
    name: "No unique characters",
    input: 's = "aabb"',
    s: "aabb",
    expected: -1
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Single character",
    input: 's = "a"',
    s: "a",
    expected: 0
  },
  {
    id: 5,
    name: "Unique at end",
    input: 's = "aab"',
    s: "aab",
    expected: 2
  }
];
