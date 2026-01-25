// Clamp To Fifty test suite
//
// Test cases for clampToFifty(int n) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = -60',
    n: -60,
    expected: -50
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
    input: 'n = 70',
    n: 70,
    expected: 50
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 120',
    n: 120,
    expected: 50
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = -100',
    n: -100,
    expected: -50
  }
];
