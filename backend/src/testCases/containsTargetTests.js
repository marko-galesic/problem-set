// Contains Target test suite
//
// Test cases for containsTarget(int[] nums, int target) method
// Returns boolean

export const runTests = [
  {
    id: 1,
    name: "Case 1",
    input: "nums = [1, 2, 3], target = 2",
    nums: [1, 2, 3],
    target: 2,
    expected: true
  },
  {
    id: 2,
    name: "Case 2",
    input: "nums = [0, -2, 5, -2], target = -2",
    nums: [0, -2, 5, -2],
    target: -2,
    expected: true
  },
  {
    id: 3,
    name: "Case 3",
    input: "nums = [4], target = 4",
    nums: [4],
    target: 4,
    expected: true
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Case 4",
    input: "nums = [-1, -3, -2], target = 7",
    nums: [-1, -3, -2],
    target: 7,
    expected: false
  },
  {
    id: 5,
    name: "Case 5",
    input: "nums = [2, 2, 2], target = 2",
    nums: [2, 2, 2],
    target: 2,
    expected: true
  }
];
