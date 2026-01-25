// Cube Plus One test suite
//
// Test cases for cubePlusOne(int n) method
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
    input: 'n = 2',
    n: 2,
    expected: 9
  },
{
    id: 3,
    name: "Case 3",
    input: 'n = -3',
    n: -3,
    expected: -26
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 'n = 4',
    n: 4,
    expected: 65
  },
{
    id: 5,
    name: "Case 5",
    input: 'n = -2',
    n: -2,
    expected: -7
  }
];
