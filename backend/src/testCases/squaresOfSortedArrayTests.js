// Squares of a Sorted Array test suite
//
// Test cases for sortedSquares(int[] nums) method
// Returns intArray

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "nums = [-4, -1, 0, 3, 10]",
    nums: [-4, -1, 0, 3, 10],
    expected: [0, 1, 9, 16, 100]
  },
  {
    id: 2,
    name: "Case 2",
    input: "nums = [-7, -3, 2, 3, 11]",
    nums: [-7, -3, 2, 3, 11],
    expected: [4, 9, 9, 49, 121]
  },
  {
    id: 3,
    name: "Case 3",
    input: "nums = [0, 1, 2]",
    nums: [0, 1, 2],
    expected: [0, 1, 4]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "nums = [-5, -4, -2]",
    nums: [-5, -4, -2],
    expected: [4, 16, 25]
  },
  {
    id: 5,
    name: "Case 5",
    input: "nums = [2, 2, 3]",
    nums: [2, 2, 3],
    expected: [4, 4, 9]
  },
  {
    id: 6,
    name: "Case 6",
    input: "nums = []",
    nums: [],
    expected: []
  }
];
