// Fibonacci Number test suite
//
// Test cases for fib(int n) method
// Returns int: nth Fibonacci number

export const runTests = [
  {
    id: 1,
    name: "Zero",
    input: "n = 0",
    n: 0,
    expected: 0
  },
  {
    id: 2,
    name: "One",
    input: "n = 1",
    n: 1,
    expected: 1
  },
  {
    id: 3,
    name: "Small value",
    input: "n = 5",
    n: 5,
    expected: 5
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Two",
    input: "n = 2",
    n: 2,
    expected: 1
  },
  {
    id: 5,
    name: "Ten",
    input: "n = 10",
    n: 10,
    expected: 55
  },
  {
    id: 6,
    name: "Twenty",
    input: "n = 20",
    n: 20,
    expected: 6765
  }
];
