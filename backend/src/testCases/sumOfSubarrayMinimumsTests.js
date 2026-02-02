// Sum of Subarray Minimums test suite
//
// Test cases for sumSubarrayMins(int[] arr) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 'arr = [3,1,2,4]',
    arr: [3, 1, 2, 4],
    expected: 17
  },
  {
    id: 2,
    name: "Two elements",
    input: 'arr = [11,81]',
    arr: [11, 81],
    expected: 103
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "All equal",
    input: 'arr = [5,5,5]',
    arr: [5, 5, 5],
    expected: 30
  },
  {
    id: 4,
    name: "Strictly decreasing",
    input: 'arr = [4,3,2,1]',
    arr: [4, 3, 2, 1],
    expected: 20
  }
];
