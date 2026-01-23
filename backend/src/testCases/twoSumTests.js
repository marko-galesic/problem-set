// Two Sum test suite
//
// Test cases for twoSum(int[] nums, int target) method
// Returns int[] with two indices [i, j] where nums[i] + nums[j] == target

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "nums = [2, 7, 11, 15], target = 9",
    nums: [2, 7, 11, 15],
    target: 9,
    expected: [0, 1]
  },
  {
    id: 2,
    name: "Different indices",
    input: "nums = [3, 2, 4], target = 6",
    nums: [3, 2, 4],
    target: 6,
    expected: [1, 2]
  },
  {
    id: 3,
    name: "Duplicate values",
    input: "nums = [3, 3], target = 6",
    nums: [3, 3],
    target: 6,
    expected: [0, 1]
  }
];

export const submitTests = [
  ...runTests,
  
  {
    id: 4,
    name: "Negative numbers",
    input: "nums = [-1, -2, -3, -4, -5], target = -8",
    nums: [-1, -2, -3, -4, -5],
    target: -8,
    expected: [2, 4]
  },
  {
    id: 5,
    name: "Mixed positive and negative",
    input: "nums = [-1, 0, 1, 2, -1, -4], target = 0",
    nums: [-1, 0, 1, 2, -1, -4],
    target: 0,
    expected: [0, 2]
  },
  {
    id: 6,
    name: "Zero in array",
    input: "nums = [0, 4, 3, 0], target = 0",
    nums: [0, 4, 3, 0],
    target: 0,
    expected: [0, 3]
  },
  {
    id: 7,
    name: "Large numbers",
    input: "nums = [1000000, 2000000, 3000000], target = 3000000",
    nums: [1000000, 2000000, 3000000],
    target: 3000000,
    expected: [0, 1]
  },
  {
    id: 10,
    name: "Single digit array",
    input: "nums = [5, 5], target = 10",
    nums: [5, 5],
    target: 10,
    expected: [0, 1]
  }
];
