// Is All Digits test suite
//
// Test cases for isAllDigits(String s) method
// Returns boolean

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "s = \"12345\"",
    s: "12345",
    expected: true
  },
  {
    id: 2,
    name: "Case 2",
    input: "s = \"001\"",
    s: "001",
    expected: true
  },
  {
    id: 3,
    name: "Case 3",
    input: "s = \"12a3\"",
    s: "12a3",
    expected: false
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "s = \"\"",
    s: "",
    expected: false
  },
  {
    id: 5,
    name: "Case 5",
    input: "s = \"9\"",
    s: "9",
    expected: true
  }
];
