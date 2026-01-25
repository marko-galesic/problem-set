// Divide By Two test suite
//
// Test cases for divideByTwo(int n) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = 0',
    n: 0,
    expected: 0
  },
{
    id: 2,
    name: "Case 2",
    input: 'n = 7',
    n: 7,
    expected: 3
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = -7',
    n: -7,
    expected: -3
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 12',
    n: 12,
    expected: 6
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = -10',
    n: -10,
    expected: -5
  }
];
