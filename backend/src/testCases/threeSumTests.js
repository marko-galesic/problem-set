// Three Sum test suite
//
// Test cases for threeSum(int[] nums) method
// Returns int[][] with unique triplets that sum to zero

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "nums = [-1, 0, 1, 2, -1, -4]",
    nums: [-1, 0, 1, 2, -1, -4],
    expected: [[-1, -1, 2], [-1, 0, 1]]
  },
  {
    id: 2,
    name: "All zeros",
    input: "nums = [0, 0, 0, 0]",
    nums: [0, 0, 0, 0],
    expected: [[0, 0, 0]]
  },
  {
    id: 3,
    name: "No valid triplets",
    input: "nums = [0, 1, 1]",
    nums: [0, 1, 1],
    expected: []
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Multiple triplets with duplicates",
    input: "nums = [-2, 0, 1, 1, 2]",
    nums: [-2, 0, 1, 1, 2],
    expected: [[-2, 0, 2], [-2, 1, 1]]
  },
  {
    id: 5,
    name: "Sorted input with repeats",
    input: "nums = [-4, -2, -2, -2, 0, 1, 2, 2, 2, 4]",
    nums: [-4, -2, -2, -2, 0, 1, 2, 2, 2, 4],
    expected: [[-4, 0, 4], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]]
  },
  {
    id: 6,
    name: "Exactly three numbers",
    input: "nums = [1, -1, 0]",
    nums: [1, -1, 0],
    expected: [[-1, 0, 1]]
  },
  {
    id: 7,
    name: "All positive",
    input: "nums = [1, 2, 3]",
    nums: [1, 2, 3],
    expected: []
  },
  {
    id: 8,
    name: "All negative",
    input: "nums = [-5, -4, -3, -2]",
    nums: [-5, -4, -3, -2],
    expected: []
  },
  {
    id: 9,
    name: "Zeros and pairs",
    input: "nums = [-1, 0, 0, 0, 1, 1, -1]",
    nums: [-1, 0, 0, 0, 1, 1, -1],
    expected: [[-1, 0, 1], [0, 0, 0]]
  }
];
