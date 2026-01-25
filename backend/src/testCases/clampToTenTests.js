// Clamp To Ten test suite
//
// Test cases for clampToTen(int n) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = -15',
    n: -15,
    expected: -10
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
    input: 'n = 12',
    n: 12,
    expected: 10
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 100',
    n: 100,
    expected: 10
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = -60',
    n: -60,
    expected: -10
  }
];
