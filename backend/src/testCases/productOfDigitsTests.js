// Product Of Digits test suite
//
// Test cases for productOfDigits(int n) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = -123',
    n: -123,
    expected: 6
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
    input: 'n = 907',
    n: 907,
    expected: 0
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 5',
    n: 5,
    expected: 5
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = 101',
    n: 101,
    expected: 0
  }
];
