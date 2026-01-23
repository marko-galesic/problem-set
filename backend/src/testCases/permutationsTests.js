// Permutations test suite
//
// Test cases for permute(int[] nums) method
// Returns int[][] with all permutations in lexicographic order

export const runTests = [
  {
    id: 1,
    name: "Basic sorted input",
    input: "nums = [1, 2, 3]",
    nums: [1, 2, 3],
    expected: [
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1]
    ]
  },
  {
    id: 2,
    name: "Unsorted input",
    input: "nums = [3, 1, 2]",
    nums: [3, 1, 2],
    expected: [
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1]
    ]
  },
  {
    id: 3,
    name: "Two elements",
    input: "nums = [0, 1]",
    nums: [0, 1],
    expected: [
      [0, 1],
      [1, 0]
    ]
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Single element",
    input: "nums = [5]",
    nums: [5],
    expected: [[5]]
  },
  {
    id: 5,
    name: "Includes negatives",
    input: "nums = [2, -1, 0]",
    nums: [2, -1, 0],
    expected: [
      [-1, 0, 2],
      [-1, 2, 0],
      [0, -1, 2],
      [0, 2, -1],
      [2, -1, 0],
      [2, 0, -1]
    ]
  },
  {
    id: 6,
    name: "Four elements",
    input: "nums = [1, 2, 3, 4]",
    nums: [1, 2, 3, 4],
    expected: [
      [1, 2, 3, 4],
      [1, 2, 4, 3],
      [1, 3, 2, 4],
      [1, 3, 4, 2],
      [1, 4, 2, 3],
      [1, 4, 3, 2],
      [2, 1, 3, 4],
      [2, 1, 4, 3],
      [2, 3, 1, 4],
      [2, 3, 4, 1],
      [2, 4, 1, 3],
      [2, 4, 3, 1],
      [3, 1, 2, 4],
      [3, 1, 4, 2],
      [3, 2, 1, 4],
      [3, 2, 4, 1],
      [3, 4, 1, 2],
      [3, 4, 2, 1],
      [4, 1, 2, 3],
      [4, 1, 3, 2],
      [4, 2, 1, 3],
      [4, 2, 3, 1],
      [4, 3, 1, 2],
      [4, 3, 2, 1]
    ]
  }
];
