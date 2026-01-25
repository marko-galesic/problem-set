// Cube Plus Two test suite
//
// Test cases for cubePlusTwo(int n) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = 0',
    n: 0,
    expected: 2
  },
{
    id: 2,
    name: "Case 2",
    input: 'n = 2',
    n: 2,
    expected: 10
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = -3',
    n: -3,
    expected: -25
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 4',
    n: 4,
    expected: 66
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = -2',
    n: -2,
    expected: -6
  }
];
