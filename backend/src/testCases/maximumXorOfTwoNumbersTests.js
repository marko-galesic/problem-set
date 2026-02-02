// Maximum XOR of Two Numbers test suite
//
// Test cases for findMaximumXOR(int[] nums) method
// Returns int

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 'nums = [3,10,5,25,2,8]',
    nums: [3, 10, 5, 25, 2, 8],
    expected: 28
  },
  {
    id: 2,
    name: "Two numbers",
    input: 'nums = [0,2]',
    nums: [0, 2],
    expected: 2
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "All equal",
    input: 'nums = [7,7,7]',
    nums: [7, 7, 7],
    expected: 0
  },
  {
    id: 4,
    name: "Large values",
    input: 'nums = [8,1,2,15]',
    nums: [8, 1, 2, 15],
    expected: 14
  }
];
