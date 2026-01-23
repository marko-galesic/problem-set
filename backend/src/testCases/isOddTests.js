// Is Odd test suite
//
// Test cases for isOdd(int n) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = 0',
    n: 0,
    expected: false
  },
{
    id: 2,
    name: "Case 2",
    input: 'n = 1',
    n: 1,
    expected: true
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = 2',
    n: 2,
    expected: false
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = -3',
    n: -3,
    expected: true
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = -4',
    n: -4,
    expected: false
  }
];
