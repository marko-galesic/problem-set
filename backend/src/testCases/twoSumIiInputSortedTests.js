// Two Sum II Input Sorted test suite
//
// Test cases for twoSum(int[] numbers, int target) method
// Returns int[] with 1-based indices [i, j] where numbers[i - 1] + numbers[j - 1] == target

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "numbers = [2, 7, 11, 15], target = 9",
    numbers: [2, 7, 11, 15],
    target: 9,
    expected: [1, 2]
  },
  {
    id: 2,
    name: "Small sorted array",
    input: "numbers = [2, 3, 4], target = 6",
    numbers: [2, 3, 4],
    target: 6,
    expected: [1, 3]
  },
  {
    id: 3,
    name: "Negative and zero",
    input: "numbers = [-1, 0], target = -1",
    numbers: [-1, 0],
    target: -1,
    expected: [1, 2]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Duplicate values",
    input: "numbers = [1, 1, 3, 5], target = 2",
    numbers: [1, 1, 3, 5],
    target: 2,
    expected: [1, 2]
  },
  {
    id: 5,
    name: "Mixed negatives and positives",
    input: "numbers = [-5, -3, -1, 0, 2, 4, 7], target = 1",
    numbers: [-5, -3, -1, 0, 2, 4, 7],
    target: 1,
    expected: [2, 6]
  },
  {
    id: 6,
    name: "Repeated midpoint",
    input: "numbers = [1, 2, 3, 4, 4, 9, 56, 90], target = 8",
    numbers: [1, 2, 3, 4, 4, 9, 56, 90],
    target: 8,
    expected: [4, 5]
  },
  {
    id: 7,
    name: "High target",
    input: "numbers = [5, 25, 75], target = 100",
    numbers: [5, 25, 75],
    target: 100,
    expected: [2, 3]
  },
  {
    id: 8,
    name: "Zeros",
    input: "numbers = [0, 0, 3, 4], target = 0",
    numbers: [0, 0, 3, 4],
    target: 0,
    expected: [1, 2]
  }
];
