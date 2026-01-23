// Longest Substring Without Repeating Characters test suite
//
// Test cases for lengthOfLongestSubstring(String s) method
// Returns int: length of the longest substring without repeating characters

export const runTests = [
  {
    id: 1,
    name: "Empty string",
    input: 's = ""',
    s: "",
    expected: 0
  },
  {
    id: 2,
    name: "Basic example",
    input: 's = "abcabcbb"',
    s: "abcabcbb",
    expected: 3
  },
  {
    id: 3,
    name: "All same characters",
    input: 's = "bbbbb"',
    s: "bbbbb",
    expected: 1
  }
];

export const submitTests = [
  ...runTests,
  
  {
    id: 4,
    name: "Single character",
    input: 's = "a"',
    s: "a",
    expected: 1
  },
  {
    id: 5,
    name: "No repeating characters",
    input: 's = "abcdef"',
    s: "abcdef",
    expected: 6
  },
  {
    id: 6,
    name: "Repeating at end",
    input: 's = "pwwkew"',
    s: "pwwkew",
    expected: 3
  },
  {
    id: 7,
    name: "Space character",
    input: 's = " "',
    s: " ",
    expected: 1
  },
  {
    id: 8,
    name: "Repeating in middle",
    input: 's = "dvdf"',
    s: "dvdf",
    expected: 3
  },
  {
    id: 9,
    name: "Mixed case",
    input: 's = "aAbBcC"',
    s: "aAbBcC",
    expected: 6
  },
  {
    id: 10,
    name: "Special characters",
    input: 's = "!@#$%^&*()"',
    s: "!@#$%^&*()",
    expected: 10
  },
  {
    id: 11,
    name: "Numbers and letters",
    input: 's = "abc123def456"',
    s: "abc123def456",
    expected: 12
  },
  {
    id: 12,
    name: "Repeating at start",
    input: 's = "aabcde"',
    s: "aabcde",
    expected: 5
  },
  {
    id: 13,
    name: "Long string with repeats",
    input: 's = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"',
    s: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
    expected: 26
  },
  {
    id: 14,
    name: "Two character string",
    input: 's = "au"',
    s: "au",
    expected: 2
  },
  {
    id: 15,
    name: "Repeating pattern",
    input: 's = "abacaba"',
    s: "abacaba",
    expected: 3
  },
  {
    id: 16,
    name: "String with spaces",
    input: 's = "hello world"',
    s: "hello world",
    expected: 6
  }
];
