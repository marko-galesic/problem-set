// Lexicographically Smallest Equivalent String test suite
//
// Test cases for smallestEquivalentString(String s1, String s2, String baseStr)
// Returns String

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 's1 = "parker", s2 = "morris", baseStr = "parser"',
    s1: "parker",
    s2: "morris",
    baseStr: "parser",
    expected: "makkek"
  },
  {
    id: 2,
    name: "Direct mapping",
    input: 's1 = "abc", s2 = "cde", baseStr = "eed"',
    s1: "abc",
    s2: "cde",
    baseStr: "eed",
    expected: "aab"
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "No mappings",
    input: 's1 = "a", s2 = "b", baseStr = "xyz"',
    s1: "a",
    s2: "b",
    baseStr: "xyz",
    expected: "xyz"
  },
  {
    id: 4,
    name: "All equivalents",
    input: 's1 = "abc", s2 = "bcd", baseStr = "abcd"',
    s1: "abc",
    s2: "bcd",
    baseStr: "abcd",
    expected: "aaaa"
  }
];
