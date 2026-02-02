// Shortest Unsorted Continuous Subarray test suite
//
// Test cases for findUnsortedSubarray(int[] nums) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 'nums = [2,6,4,8,10,9,15]',
    nums: [2, 6, 4, 8, 10, 9, 15],
    expected: 5
  },
  {
    id: 2,
    name: "Already sorted",
    input: 'nums = [1,2,3,4]',
    nums: [1, 2, 3, 4],
    expected: 0
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Reverse sorted",
    input: 'nums = [4,3,2,1]',
    nums: [4, 3, 2, 1],
    expected: 4
  },
  {
    id: 4,
    name: "Small disorder",
    input: 'nums = [1,3,2,2,2]',
    nums: [1, 3, 2, 2, 2],
    expected: 4
  }
];
