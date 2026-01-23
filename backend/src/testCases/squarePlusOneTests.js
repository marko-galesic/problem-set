// Square Plus One test suite
//
// Test cases for squarePlusOne(int n) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "n = 0",
    n: 0,
    expected: 1
  },
  {
    id: 2,
    name: "Case 2",
    input: "n = 5",
    n: 5,
    expected: 26
  },
  {
    id: 3,
    name: "Case 3",
    input: "n = -3",
    n: -3,
    expected: 10
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "n = 12",
    n: 12,
    expected: 145
  },
  {
    id: 5,
    name: "Case 5",
    input: "n = -10",
    n: -10,
    expected: 101
  }
];
