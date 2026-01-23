// Count Greater Than test suite
//
// Test cases for countGreaterThan(int[] nums, int threshold) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "nums = [1, 2, 3], threshold = 1",
    nums: [1, 2, 3],
    threshold: 1,
    expected: 2
  },
  {
    id: 2,
    name: "Case 2",
    input: "nums = [0, -2, 5], threshold = 0",
    nums: [0, -2, 5],
    threshold: 0,
    expected: 1
  },
  {
    id: 3,
    name: "Case 3",
    input: "nums = [4], threshold = 3",
    nums: [4],
    threshold: 3,
    expected: 1
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "nums = [], threshold = 0",
    nums: [],
    threshold: 0,
    expected: 0
  },
  {
    id: 5,
    name: "Case 5",
    input: "nums = [2, 2, 2], threshold = 2",
    nums: [2, 2, 2],
    threshold: 2,
    expected: 0
  }
];
