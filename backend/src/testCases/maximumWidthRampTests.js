// Maximum Width Ramp test suite
//
// Test cases for maxWidthRamp(int[] nums) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 'nums = [6,0,8,2,1,5]',
    nums: [6, 0, 8, 2, 1, 5],
    expected: 4
  },
  {
    id: 2,
    name: "Non-decreasing",
    input: 'nums = [1,2,3,4]',
    nums: [1, 2, 3, 4],
    expected: 3
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "All equal",
    input: 'nums = [5,5,5]',
    nums: [5, 5, 5],
    expected: 2
  },
  {
    id: 4,
    name: "Decreasing",
    input: 'nums = [4,3,2,1]',
    nums: [4, 3, 2, 1],
    expected: 0
  }
];
