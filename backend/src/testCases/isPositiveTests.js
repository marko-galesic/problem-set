// Is Positive test suite
//
// Test cases for isPositive(int n) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = -1',
    n: -1,
    expected: false
  },
{
    id: 2,
    name: "Case 2",
    input: 'n = 0',
    n: 0,
    expected: false
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = 3',
    n: 3,
    expected: true
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 10',
    n: 10,
    expected: true
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = -5',
    n: -5,
    expected: false
  }
];
