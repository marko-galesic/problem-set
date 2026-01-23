// Count Occurrences Of Char test suite
//
// Test cases for countOccurrencesOfChar(String s, String c) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "s = \"hello\", c = \"l\"",
    s: "hello",
    c: "l",
    expected: 2
  },
  {
    id: 2,
    name: "Case 2",
    input: "s = \"apple\", c = \"p\"",
    s: "apple",
    c: "p",
    expected: 2
  },
  {
    id: 3,
    name: "Case 3",
    input: "s = \"test\", c = \"z\"",
    s: "test",
    c: "z",
    expected: 0
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "s = \"\", c = \"a\"",
    s: "",
    c: "a",
    expected: 0
  },
  {
    id: 5,
    name: "Case 5",
    input: "s = \"mississippi\", c = \"s\"",
    s: "mississippi",
    c: "s",
    expected: 4
  }
];
