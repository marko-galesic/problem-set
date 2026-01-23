// Number Of Digits test suite
//
// Test cases for numberOfDigits(int n) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = 0',
    n: 0,
    expected: 1
  },
{
    id: 2,
    name: "Case 2",
    input: 'n = 7',
    n: 7,
    expected: 1
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = 10',
    n: 10,
    expected: 2
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = -999',
    n: -999,
    expected: 3
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = 10000',
    n: 10000,
    expected: 5
  },
{
    id: 6,
    name: "Case 6",
    input: 'n = -2147483648',
    n: -2147483648,
    expected: 10
  }
];
