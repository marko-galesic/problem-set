// Next Greater Element I test suite
//
// Test cases for nextGreaterElement(int[] nums1, int[] nums2) method
// Returns int[]

export const runTests = [
  {
    id: 1,
    name: "Classic example",
    input: 'nums1 = [4,1,2], nums2 = [1,3,4,2]',
    nums1: [4, 1, 2],
    nums2: [1, 3, 4, 2],
    expected: [-1, 3, -1]
  },
  {
    id: 2,
    name: "All have next greater",
    input: 'nums1 = [2,4], nums2 = [1,2,3,4]',
    nums1: [2, 4],
    nums2: [1, 2, 3, 4],
    expected: [3, -1]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Single element",
    input: 'nums1 = [1], nums2 = [1]',
    nums1: [1],
    nums2: [1],
    expected: [-1]
  },
  {
    id: 4,
    name: "Reverse order",
    input: 'nums1 = [3,2], nums2 = [3,2,1]',
    nums1: [3, 2],
    nums2: [3, 2, 1],
    expected: [-1, -1]
  }
];
