// Move Zeroes test suite
//
// Test cases for moveZeroes(int[] nums) method
// Returns int[] with zeros moved to the end in stable order

export const runTests = [
  {
    id: 1,
    name: "Zeros in middle",
    input: "nums = [0, 1, 0, 3, 12]",
    nums: [0, 1, 0, 3, 12],
    expected: [1, 3, 12, 0, 0]
  },
  {
    id: 2,
    name: "All zeros",
    input: "nums = [0, 0]",
    nums: [0, 0],
    expected: [0, 0]
  },
  {
    id: 3,
    name: "No zeros",
    input: "nums = [1, 2, 3]",
    nums: [1, 2, 3],
    expected: [1, 2, 3]
  },
  {
    id: 4,
    name: "Multiple zeros",
    input: "nums = [0, 1, 0, 0, 2]",
    nums: [0, 1, 0, 0, 2],
    expected: [1, 2, 0, 0, 0]
  },
  {
    id: 5,
    name: "Mixed zeros",
    input: "nums = [4, 0, 5, 0, 0, 3]",
    nums: [4, 0, 5, 0, 0, 3],
    expected: [4, 5, 3, 0, 0, 0]
  }
];

export const submitTests = [
  ...runTests
];
