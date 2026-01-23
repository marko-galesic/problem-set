// Four Sum test suite
//
// Test cases for fourSum(int[] nums, int target) method
// Returns int[][] of unique quadruplets sorted lexicographically

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "nums = [1, 0, -1, 0, -2, 2], target = 0",
    nums: [1, 0, -1, 0, -2, 2],
    target: 0,
    expected: [
      [-2, -1, 1, 2],
      [-2, 0, 0, 2],
      [-1, 0, 0, 1]
    ]
  },
  {
    id: 2,
    name: "All zeros",
    input: "nums = [0, 0, 0, 0, 0], target = 0",
    nums: [0, 0, 0, 0, 0],
    target: 0,
    expected: [[0, 0, 0, 0]]
  },
  {
    id: 3,
    name: "No solution",
    input: "nums = [1, 2, 3, 4], target = 100",
    nums: [1, 2, 3, 4],
    target: 100,
    expected: []
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "All duplicates",
    input: "nums = [2, 2, 2, 2, 2], target = 8",
    nums: [2, 2, 2, 2, 2],
    target: 8,
    expected: [[2, 2, 2, 2]]
  },
  {
    id: 5,
    name: "Duplicate negatives and positives",
    input: "nums = [-2, -1, -1, 1, 1, 2, 2], target = 0",
    nums: [-2, -1, -1, 1, 1, 2, 2],
    target: 0,
    expected: [
      [-2, -1, 1, 2],
      [-1, -1, 1, 1]
    ]
  },
  {
    id: 6,
    name: "Too few numbers",
    input: "nums = [1, 2, 3], target = 6",
    nums: [1, 2, 3],
    target: 6,
    expected: []
  },
  {
    id: 7,
    name: "Large magnitude values",
    input: "nums = [1000000000, 1000000000, -1000000000, -1000000000, 0], target = 0",
    nums: [1000000000, 1000000000, -1000000000, -1000000000, 0],
    target: 0,
    expected: [[-1000000000, -1000000000, 1000000000, 1000000000]]
  },
  {
    id: 8,
    name: "Negative target with zeros",
    input: "nums = [-3, -2, -1, 0, 0, 1, 2, 3], target = -1",
    nums: [-3, -2, -1, 0, 0, 1, 2, 3],
    target: -1,
    expected: [
      [-3, -2, 1, 3],
      [-3, -1, 0, 3],
      [-3, -1, 1, 2],
      [-3, 0, 0, 2],
      [-2, -1, 0, 2],
      [-2, 0, 0, 1]
    ]
  }
];
