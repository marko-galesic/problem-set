// Valid Palindrome II test suite
//
// Test cases for validPalindrome(String s) method
// Returns boolean: true if can be palindrome after one deletion, false otherwise

export const runTests = [
  {
    id: 1,
    name: "Already a palindrome",
    input: 's = "aba"',
    s: "aba",
    expected: true
  },
  {
    id: 2,
    name: "Remove one character to match",
    input: 's = "abca"',
    s: "abca",
    expected: true
  },
  {
    id: 3,
    name: "Cannot be fixed with one removal",
    input: 's = "abc"',
    s: "abc",
    expected: false
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Empty string",
    input: 's = ""',
    s: "",
    expected: true
  },
  {
    id: 5,
    name: "Single character",
    input: 's = "a"',
    s: "a",
    expected: true
  },
  {
    id: 6,
    name: "Two characters",
    input: 's = "ab"',
    s: "ab",
    expected: true
  },
  {
    id: 7,
    name: "Palindrome without deletion",
    input: 's = "deed"',
    s: "deed",
    expected: true
  },
  {
    id: 8,
    name: "Deletion in middle",
    input: 's = "abccdba"',
    s: "abccdba",
    expected: true
  },
  {
    id: 9,
    name: "Remove first character",
    input: 's = "baa"',
    s: "baa",
    expected: true
  },
  {
    id: 10,
    name: "Remove last character",
    input: 's = "aab"',
    s: "aab",
    expected: true
  },
  {
    id: 11,
    name: "Still not a palindrome",
    input: 's = "abcda"',
    s: "abcda",
    expected: false
  },
  {
    id: 12,
    name: "Long mismatch",
    input: 's = "abcdef"',
    s: "abcdef",
    expected: false
  }
];
