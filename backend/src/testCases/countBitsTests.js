// Count Bits test suite
//
// Test cases for countBits(int n) method
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
    input: 'n = 1',
    n: 1,
    expected: 1
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = 2',
    n: 2,
    expected: 1
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 7',
    n: 7,
    expected: 3
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = 1023',
    n: 1023,
    expected: 10
  }
];
