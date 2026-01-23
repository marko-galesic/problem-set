// Top K Frequent Elements test suite
//
// Test cases for topKFrequent(int[] nums, int k) method
// Returns int[] with the k most frequent elements

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "nums = [1, 1, 1, 2, 2, 3], k = 2",
    nums: [1, 1, 1, 2, 2, 3],
    k: 2,
    expected: [1, 2]
  },
  {
    id: 2,
    name: "Tie frequencies",
    input: "nums = [4, 4, 5, 5, 6], k = 2",
    nums: [4, 4, 5, 5, 6],
    k: 2,
    expected: [4, 5]
  },
  {
    id: 3,
    name: "Negative and zero values",
    input: "nums = [0, -1, -1, -2, -2, -2], k = 2",
    nums: [0, -1, -1, -2, -2, -2],
    k: 2,
    expected: [-2, -1]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "k equals 1",
    input: "nums = [7, 7, 8, 8, 8], k = 1",
    nums: [7, 7, 8, 8, 8],
    k: 1,
    expected: [8]
  },
  {
    id: 5,
    name: "k equals number of unique elements",
    input: "nums = [5, 5, 4, 4, 3, 2, 2, 2], k = 4",
    nums: [5, 5, 4, 4, 3, 2, 2, 2],
    k: 4,
    expected: [2, 4, 5, 3]
  },
  {
    id: 6,
    name: "Larger mixed array",
    input: "nums = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6], k = 3",
    nums: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6],
    k: 3,
    expected: [4, 3, 2]
  }
];
