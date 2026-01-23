// Min Of Three Numbers test suite
//
// Test cases for minOfThreeNumbers(int a, int b, int c) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "a = 1, b = 2, c = 3",
    a: 1,
    b: 2,
    c: 3,
    expected: 1
  },
  {
    id: 2,
    name: "Case 2",
    input: "a = -1, b = 5, c = 0",
    a: -1,
    b: 5,
    c: 0,
    expected: -1
  },
  {
    id: 3,
    name: "Case 3",
    input: "a = 0, b = 0, c = 0",
    a: 0,
    b: 0,
    c: 0,
    expected: 0
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "a = 7, b = 3, c = 9",
    a: 7,
    b: 3,
    c: 9,
    expected: 3
  },
  {
    id: 5,
    name: "Case 5",
    input: "a = -4, b = -2, c = -8",
    a: -4,
    b: -2,
    c: -8,
    expected: -8
  }
];
