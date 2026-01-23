// Reverse String test suite
//
// Test cases for reverseString(String s) method
// Returns String: reversed input string

export const runTests = [
  {
    id: 1,
    name: "Basic word",
    input: 's = "hello"',
    s: "hello",
    expected: "olleh"
  },
  {
    id: 2,
    name: "Empty string",
    input: 's = ""',
    s: "",
    expected: ""
  },
  {
    id: 3,
    name: "Single character",
    input: 's = "a"',
    s: "a",
    expected: "a"
  },
  {
    id: 4,
    name: "Palindrome",
    input: 's = "racecar"',
    s: "racecar",
    expected: "racecar"
  },
  {
    id: 5,
    name: "Spaces preserved",
    input: 's = "Hello World"',
    s: "Hello World",
    expected: "dlroW olleH"
  }
];

export const submitTests = [
  ...runTests
];
