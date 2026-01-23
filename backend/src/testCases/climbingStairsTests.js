// Climbing Stairs test suite
//
// Test cases for climbStairs(int n) method
// Returns int: number of distinct ways to reach the top

export const runTests = [
  {
    id: 1,
    name: "One step",
    input: "n = 1",
    n: 1,
    expected: 1
  },
  {
    id: 2,
    name: "Two steps",
    input: "n = 2",
    n: 2,
    expected: 2
  },
  {
    id: 3,
    name: "Three steps",
    input: "n = 3",
    n: 3,
    expected: 3
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Four steps",
    input: "n = 4",
    n: 4,
    expected: 5
  },
  {
    id: 5,
    name: "Five steps",
    input: "n = 5",
    n: 5,
    expected: 8
  },
  {
    id: 6,
    name: "Ten steps",
    input: "n = 10",
    n: 10,
    expected: 89
  }
];
