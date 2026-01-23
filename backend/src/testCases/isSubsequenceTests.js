// Is Subsequence test suite
//
// Test cases for isSubsequence(String s, String t) method
// Returns boolean: true if s is a subsequence of t

export const runTests = [
  {
    id: 1,
    name: "Basic subsequence present",
    input: 's = "abc", t = "ahbgdc"',
    s: "abc",
    t: "ahbgdc",
    expected: true
  },
  {
    id: 2,
    name: "Subsequence absent",
    input: 's = "axc", t = "ahbgdc"',
    s: "axc",
    t: "ahbgdc",
    expected: false
  },
  {
    id: 3,
    name: "Empty s",
    input: 's = "", t = "ahbgdc"',
    s: "",
    t: "ahbgdc",
    expected: true
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Interleaved subsequence",
    input: 's = "ace", t = "abcde"',
    s: "ace",
    t: "abcde",
    expected: true
  },
  {
    id: 5,
    name: "Order mismatch",
    input: 's = "aec", t = "abcde"',
    s: "aec",
    t: "abcde",
    expected: false
  },
  {
    id: 6,
    name: "s longer than t",
    input: 's = "aaaa", t = "aa"',
    s: "aaaa",
    t: "aa",
    expected: false
  },
  {
    id: 7,
    name: "Empty t",
    input: 's = "a", t = ""',
    s: "a",
    t: "",
    expected: false
  },
  {
    id: 8,
    name: "Exact match",
    input: 's = "abc", t = "abc"',
    s: "abc",
    t: "abc",
    expected: true
  },
  {
    id: 9,
    name: "Case sensitivity",
    input: 's = "A", t = "aA"',
    s: "A",
    t: "aA",
    expected: true
  }
];
