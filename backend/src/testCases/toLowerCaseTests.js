// To Lower Case test suite
//
// Test cases for toLowerCase(String s) method
// Returns String: lowercase version of input

export const runTests = [
  {
    id: 1,
    name: "Basic mixed case",
    input: 's = "Hello"',
    s: "Hello",
    expected: "hello"
  },
  {
    id: 2,
    name: "Already lowercase",
    input: 's = "here"',
    s: "here",
    expected: "here"
  },
  {
    id: 3,
    name: "All uppercase",
    input: 's = "LOVELY"',
    s: "LOVELY",
    expected: "lovely"
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Mixed letters and symbols",
    input: 's = "al&phaBET"',
    s: "al&phaBET",
    expected: "al&phabet"
  },
  {
    id: 5,
    name: "Digits and letters",
    input: 's = "Java123"',
    s: "Java123",
    expected: "java123"
  },
  {
    id: 6,
    name: "Empty string",
    input: 's = ""',
    s: "",
    expected: ""
  },
  {
    id: 7,
    name: "Single character",
    input: 's = "Z"',
    s: "Z",
    expected: "z"
  }
];
