// Multiply By Six test suite
//
// Test cases for multiplyBySix(int n) method
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
    expected: 30
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = -3',
    n: -3,
    expected: -18
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 12',
    n: 12,
    expected: 72
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = -10',
    n: -10,
    expected: -60
  }
];
