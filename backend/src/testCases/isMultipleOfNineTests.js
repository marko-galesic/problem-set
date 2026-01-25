// Is Multiple Of Nine test suite
//
// Test cases for isMultipleOfNine(int n) method
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
    input: 'n = 9',
    n: 9,
    expected: true
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = 10',
    n: 10,
    expected: false
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = -9',
    n: -9,
    expected: true
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = 19',
    n: 19,
    expected: false
  }
];
