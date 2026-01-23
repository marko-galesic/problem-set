// Digital Root test suite
//
// Test cases for digitalRoot(int n) method
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
    input: 'n = 5',
    n: 5,
    expected: 5
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = 38',
    n: 38,
    expected: 2
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 9999',
    n: 9999,
    expected: 9
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = -12',
    n: -12,
    expected: 3
  }
];
