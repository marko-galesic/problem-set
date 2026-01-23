// Remove Element test suite
//
// Test cases for removeElement(int[] nums, int val) method
// Returns int: count of elements not equal to val after in-place removal

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "nums = [3, 2, 2, 3], val = 3",
    nums: [3, 2, 2, 3],
    val: 3,
    expected: 2
  },
  {
    id: 2,
    name: "Multiple removals",
    input: "nums = [0, 1, 2, 2, 3, 0, 4, 2], val = 2",
    nums: [0, 1, 2, 2, 3, 0, 4, 2],
    val: 2,
    expected: 5
  },
  {
    id: 3,
    name: "No removals",
    input: "nums = [1, 2, 3], val = 4",
    nums: [1, 2, 3],
    val: 4,
    expected: 3
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Empty array",
    input: "nums = [], val = 1",
    nums: [],
    val: 1,
    expected: 0
  },
  {
    id: 5,
    name: "All removed",
    input: "nums = [7, 7, 7], val = 7",
    nums: [7, 7, 7],
    val: 7,
    expected: 0
  },
  {
    id: 6,
    name: "Single element kept",
    input: "nums = [5], val = 2",
    nums: [5],
    val: 2,
    expected: 1
  },
  {
    id: 7,
    name: "Single element removed",
    input: "nums = [5], val = 5",
    nums: [5],
    val: 5,
    expected: 0
  },
  {
    id: 8,
    name: "Negatives and zeros",
    input: "nums = [-1, 0, -1, 2, 3], val = -1",
    nums: [-1, 0, -1, 2, 3],
    val: -1,
    expected: 3
  },
  {
    id: 9,
    name: "Value at ends",
    input: "nums = [4, 1, 2, 4, 3, 4], val = 4",
    nums: [4, 1, 2, 4, 3, 4],
    val: 4,
    expected: 3
  }
];
