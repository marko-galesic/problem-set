// Next Greater Element II test suite
//
// Test cases for nextGreaterElements(int[] nums) method
// Returns int[]

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 'nums = [1,2,1]',
    nums: [1, 2, 1],
    expected: [2, -1, 2]
  },
  {
    id: 2,
    name: "All equal",
    input: 'nums = [5,5,5]',
    nums: [5, 5, 5],
    expected: [-1, -1, -1]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Strictly increasing",
    input: 'nums = [1,2,3,4]',
    nums: [1, 2, 3, 4],
    expected: [2, 3, 4, -1]
  },
  {
    id: 4,
    name: "Strictly decreasing",
    input: 'nums = [4,3,2,1]',
    nums: [4, 3, 2, 1],
    expected: [-1, 4, 4, 4]
  }
];
