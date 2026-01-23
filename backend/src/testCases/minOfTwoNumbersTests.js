// Min Of Two Numbers test suite
//
// Test cases for minOfTwoNumbers(int a, int b) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "a = 2, b = 3",
    a: 2,
    b: 3,
    expected: 2
  },
  {
    id: 2,
    name: "Case 2",
    input: "a = -5, b = 7",
    a: -5,
    b: 7,
    expected: -5
  },
  {
    id: 3,
    name: "Case 3",
    input: "a = 0, b = 0",
    a: 0,
    b: 0,
    expected: 0
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "a = 10, b = -2",
    a: 10,
    b: -2,
    expected: -2
  },
  {
    id: 5,
    name: "Case 5",
    input: "a = -4, b = -6",
    a: -4,
    b: -6,
    expected: -6
  }
];
