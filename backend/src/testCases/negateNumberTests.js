// Negate Number test suite
//
// Test cases for negateNumber(int n) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = -5',
    n: -5,
    expected: 5
  },
{
    id: 2,
    name: "Case 2",
    input: 'n = 0',
    n: 0,
    expected: 0
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = 7',
    n: 7,
    expected: -7
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 12',
    n: 12,
    expected: -12
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = -1',
    n: -1,
    expected: 1
  }
];
