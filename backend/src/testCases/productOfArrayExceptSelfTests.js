// Product of Array Except Self test suite
//
// Test cases for productExceptSelf(int[] nums) method
// Returns int[] where each element is the product of all other elements

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "nums = [1, 2, 3, 4]",
    nums: [1, 2, 3, 4],
    expected: [24, 12, 8, 6]
  },
  {
    id: 2,
    name: "Single zero",
    input: "nums = [1, 2, 0, 4]",
    nums: [1, 2, 0, 4],
    expected: [0, 0, 8, 0]
  },
  {
    id: 3,
    name: "Mixed negatives",
    input: "nums = [-1, 1, -1, 1]",
    nums: [-1, 1, -1, 1],
    expected: [-1, 1, -1, 1]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Two zeros",
    input: "nums = [0, 0, 2, 3]",
    nums: [0, 0, 2, 3],
    expected: [0, 0, 0, 0]
  },
  {
    id: 5,
    name: "Zero with negatives",
    input: "nums = [-1, 1, 0, -3, 3]",
    nums: [-1, 1, 0, -3, 3],
    expected: [0, 0, 9, 0, 0]
  },
  {
    id: 6,
    name: "Longer array",
    input: "nums = [2, 3, 4, 5, 6]",
    nums: [2, 3, 4, 5, 6],
    expected: [360, 240, 180, 144, 120]
  }
];
