// Longest Repeating Character Replacement test suite
//
// Test cases for characterReplacement(String s, int k) method
// Returns int: length of the longest substring that can be made of the same letter

export const runTests = [
  {
    id: 1,
    name: "Empty string",
    input: 's = "", k = 0',
    s: "",
    k: 0,
    expected: 0
  },
  {
    id: 2,
    name: "Basic example",
    input: 's = "ABAB", k = 2',
    s: "ABAB",
    k: 2,
    expected: 4
  },
  {
    id: 3,
    name: "Standard example",
    input: 's = "AABABBA", k = 1',
    s: "AABABBA",
    k: 1,
    expected: 4
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Single character",
    input: 's = "A", k = 0',
    s: "A",
    k: 0,
    expected: 1
  },
  {
    id: 5,
    name: "All same characters",
    input: 's = "AAAA", k = 2',
    s: "AAAA",
    k: 2,
    expected: 4
  },
  {
    id: 6,
    name: "No replacements allowed",
    input: 's = "ABCD", k = 0',
    s: "ABCD",
    k: 0,
    expected: 1
  },
  {
    id: 7,
    name: "Limited replacements",
    input: 's = "ABCD", k = 2',
    s: "ABCD",
    k: 2,
    expected: 3
  },
  {
    id: 8,
    name: "Replace ends to match middle",
    input: 's = "BAAAB", k = 2',
    s: "BAAAB",
    k: 2,
    expected: 5
  },
  {
    id: 9,
    name: "k larger than length",
    input: 's = "ABCDE", k = 10',
    s: "ABCDE",
    k: 10,
    expected: 5
  },
  {
    id: 10,
    name: "No replacements, repeated tail",
    input: 's = "ABAA", k = 0',
    s: "ABAA",
    k: 0,
    expected: 2
  },
  {
    id: 11,
    name: "One replacement to fill",
    input: 's = "ABAA", k = 1',
    s: "ABAA",
    k: 1,
    expected: 4
  },
  {
    id: 12,
    name: "Alternating without replacements",
    input: 's = "ABAB", k = 0',
    s: "ABAB",
    k: 0,
    expected: 1
  }
];
