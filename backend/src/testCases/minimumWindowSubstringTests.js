// Minimum Window Substring test suite
//
// Test cases for minWindow(String s, String t) method
// Returns string: smallest window of s containing all chars of t

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 's = "ADOBECODEBANC", t = "ABC"',
    s: "ADOBECODEBANC",
    t: "ABC",
    expected: "BANC"
  },
  {
    id: 2,
    name: "Single character match",
    input: 's = "a", t = "a"',
    s: "a",
    t: "a",
    expected: "a"
  },
  {
    id: 3,
    name: "Target longer than source",
    input: 's = "a", t = "aa"',
    s: "a",
    t: "aa",
    expected: ""
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Minimum window at the end",
    input: 's = "bba", t = "ab"',
    s: "bba",
    t: "ab",
    expected: "ba"
  },
  {
    id: 5,
    name: "Window with extra characters",
    input: 's = "aaabdec", t = "abc"',
    s: "aaabdec",
    t: "abc",
    expected: "abdec"
  },
  {
    id: 6,
    name: "Repeated target characters",
    input: 's = "aaflslflsldkalskaaa", t = "aaa"',
    s: "aaflslflsldkalskaaa",
    t: "aaa",
    expected: "aaa"
  },
  {
    id: 7,
    name: "No window exists",
    input: 's = "abcdef", t = "gh"',
    s: "abcdef",
    t: "gh",
    expected: ""
  },
  {
    id: 8,
    name: "Empty target",
    input: 's = "abc", t = ""',
    s: "abc",
    t: "",
    expected: ""
  }
];
