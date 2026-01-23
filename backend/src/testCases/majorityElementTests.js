// Majority Element test suite
//
// Test cases for majorityElement(int[] nums) method
// Returns int: element that appears more than n / 2 times

export const runTests = [
  {
    id: 1,
    name: "Simple majority",
    input: "nums = [3, 2, 3]",
    nums: [3, 2, 3],
    expected: 3
  },
  {
    id: 2,
    name: "Majority in mixed array",
    input: "nums = [2, 2, 1, 1, 1, 2, 2]",
    nums: [2, 2, 1, 1, 1, 2, 2],
    expected: 2
  },
  {
    id: 3,
    name: "Single element",
    input: "nums = [1]",
    nums: [1],
    expected: 1
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Negative majority",
    input: "nums = [-1, -1, -1, 2, 2]",
    nums: [-1, -1, -1, 2, 2],
    expected: -1
  },
  {
    id: 5,
    name: "Majority with duplicates",
    input: "nums = [5, 5, 5, 3, 3]",
    nums: [5, 5, 5, 3, 3],
    expected: 5
  }
];
