// Repeat N Times test suite
//
// Test cases for repeatNTimes(String s, int n) method
// Returns string

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "s = \"ab\", n = 3",
    s: "ab",
    n: 3,
    expected: "ababab"
  },
  {
    id: 2,
    name: "Case 2",
    input: "s = \"x\", n = 0",
    s: "x",
    n: 0,
    expected: ""
  },
  {
    id: 3,
    name: "Case 3",
    input: "s = \"hi\", n = 1",
    s: "hi",
    n: 1,
    expected: "hi"
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "s = \"\", n = 5",
    s: "",
    n: 5,
    expected: ""
  },
  {
    id: 5,
    name: "Case 5",
    input: "s = \"yo\", n = 2",
    s: "yo",
    n: 2,
    expected: "yoyo"
  }
];
