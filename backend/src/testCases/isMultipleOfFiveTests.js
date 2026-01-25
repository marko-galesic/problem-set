// Is Multiple Of Five test suite
//
// Test cases for isMultipleOfFive(int n) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 'n = 0',
    n: 0,
    expected: true
  },
{
    id: 2,
    name: "Case 2",
    input: 'n = 5',
    n: 5,
    expected: true
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = 6',
    n: 6,
    expected: false
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = -5',
    n: -5,
    expected: true
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = 11',
    n: 11,
    expected: false
  }
];
