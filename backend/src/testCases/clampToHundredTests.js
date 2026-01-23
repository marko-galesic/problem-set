// Clamp To Hundred test suite
//
// Test cases for clampToHundred(int n) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = -150',
    n: -150,
    expected: -100
  },
{
    id: 2,
    name: "Case 2",
    input: 'n = -100',
    n: -100,
    expected: -100
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = 0',
    n: 0,
    expected: 0
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 50',
    n: 50,
    expected: 50
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = 120',
    n: 120,
    expected: 100
  }
];
