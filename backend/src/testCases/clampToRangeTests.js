// Clamp To Range test suite
//
// Test cases for clampToRange(int n, int low, int high) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "n = 5, low = 0, high = 10",
    n: 5,
    low: 0,
    high: 10,
    expected: 5
  },
  {
    id: 2,
    name: "Case 2",
    input: "n = -5, low = 0, high = 10",
    n: -5,
    low: 0,
    high: 10,
    expected: 0
  },
  {
    id: 3,
    name: "Case 3",
    input: "n = 15, low = 0, high = 10",
    n: 15,
    low: 0,
    high: 10,
    expected: 10
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "n = 7, low = 7, high = 9",
    n: 7,
    low: 7,
    high: 9,
    expected: 7
  },
  {
    id: 5,
    name: "Case 5",
    input: "n = 4, low = 1, high = 3",
    n: 4,
    low: 1,
    high: 3,
    expected: 3
  }
];
