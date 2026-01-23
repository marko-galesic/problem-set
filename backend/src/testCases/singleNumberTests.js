// Single Number test suite
//
// Test cases for singleNumber(int[] nums) method
// Returns int: element that appears once

export const runTests = [
  {
    id: 1,
    name: "Simple pair and single",
    input: "nums = [2, 2, 1]",
    nums: [2, 2, 1],
    expected: 1
  },
  {
    id: 2,
    name: "Single in middle",
    input: "nums = [4, 1, 2, 1, 2]",
    nums: [4, 1, 2, 1, 2],
    expected: 4
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
    name: "Zero and single",
    input: "nums = [0, 1, 0]",
    nums: [0, 1, 0],
    expected: 1
  },
  {
    id: 5,
    name: "Negative values",
    input: "nums = [-1, -1, -2]",
    nums: [-1, -1, -2],
    expected: -2
  }
];
