// Reverse Digits test suite
//
// Test cases for reverseDigits(int n) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = -120',
    n: -120,
    expected: -21
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
    input: 'n = 305',
    n: 305,
    expected: 503
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 7',
    n: 7,
    expected: 7
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = -900',
    n: -900,
    expected: -9
  }
];
