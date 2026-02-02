// Smallest String With Swaps test suite
//
// Test cases for smallestStringWithSwaps(String s, int[][] pairs) method
// Returns String

export const runTests = [
  {
    id: 1,
    name: "Basic swap",
    input: 's = "dcab", pairs = [[0,3],[1,2]]',
    s: "dcab",
    pairs: [[0, 3], [1, 2]],
    expected: "bacd"
  },
  {
    id: 2,
    name: "Connected component",
    input: 's = "dcab", pairs = [[0,3],[1,2],[0,2]]',
    s: "dcab",
    pairs: [[0, 3], [1, 2], [0, 2]],
    expected: "abcd"
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "No pairs",
    input: 's = "abc", pairs = []',
    s: "abc",
    pairs: [],
    expected: "abc"
  },
  {
    id: 4,
    name: "Single component",
    input: 's = "cba", pairs = [[0,1],[1,2]]',
    s: "cba",
    pairs: [[0, 1], [1, 2]],
    expected: "abc"
  }
];
