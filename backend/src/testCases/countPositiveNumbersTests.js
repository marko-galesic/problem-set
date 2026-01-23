// Count Positive Numbers test suite
//
// Test cases for countPositiveNumbers(int[] nums) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "nums = [1, 2, 3]",
    nums: [1, 2, 3],
    expected: 3
  },
  {
    id: 2,
    name: "Case 2",
    input: "nums = [0, -2, 5]",
    nums: [0, -2, 5],
    expected: 1
  },
  {
    id: 3,
    name: "Case 3",
    input: "nums = [-1, -3, -2]",
    nums: [-1, -3, -2],
    expected: 0
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "nums = [4]",
    nums: [4],
    expected: 1
  },
  {
    id: 5,
    name: "Case 5",
    input: "nums = [2, 2, 2]",
    nums: [2, 2, 2],
    expected: 3
  }
];
