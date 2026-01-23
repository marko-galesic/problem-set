// Swap First Last Char test suite
//
// Test cases for swapFirstLastChar(String s) method
// Returns string

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "s = \"ab\"",
    s: "ab",
    expected: "ba"
  },
  {
    id: 2,
    name: "Case 2",
    input: "s = \"hello\"",
    s: "hello",
    expected: "oellh"
  },
  {
    id: 3,
    name: "Case 3",
    input: "s = \"a\"",
    s: "a",
    expected: "a"
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "s = \"\"",
    s: "",
    expected: ""
  },
  {
    id: 5,
    name: "Case 5",
    input: "s = \"xy\"",
    s: "xy",
    expected: "yx"
  }
];
