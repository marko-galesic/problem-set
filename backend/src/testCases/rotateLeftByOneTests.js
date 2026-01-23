// Rotate Left By One test suite
//
// Test cases for rotateLeftByOne(int[] nums) method
// Returns intArray

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "nums = [1, 2, 3]",
    nums: [1, 2, 3],
    expected: [2, 3, 1]
  },
  {
    id: 2,
    name: "Case 2",
    input: "nums = [0, -2, 5]",
    nums: [0, -2, 5],
    expected: [-2, 5, 0]
  },
  {
    id: 3,
    name: "Case 3",
    input: "nums = [4]",
    nums: [4],
    expected: [4]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "nums = []",
    nums: [],
    expected: []
  },
  {
    id: 5,
    name: "Case 5",
    input: "nums = [2, 2, 2]",
    nums: [2, 2, 2],
    expected: [2, 2, 2]
  }
];
