// Is Power Of Two test suite
//
// Test cases for isPowerOfTwo(int n) method
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
    expected: true
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 3',
    n: 3,
    expected: false
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = 16',
    n: 16,
    expected: true
  },
{
    id: 6,
    name: "Case 6",
    input: 'n = -8',
    n: -8,
    expected: false
  }
];
