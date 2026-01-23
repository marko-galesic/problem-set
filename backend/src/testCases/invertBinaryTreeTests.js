// Invert Binary Tree test suite
//
// Test cases for invertTree(TreeNode root) method
// Returns TreeNode: the root of the inverted binary tree
// Test cases use level-order array representation with nulls for missing nodes

export const runTests = [
  {
    id: 1,
    name: "Perfect binary tree",
    input: "root = [4, 2, 7, 1, 3, 6, 9]",
    root: [4, 2, 7, 1, 3, 6, 9],
    expected: [4, 7, 2, 9, 6, 3, 1]
  },
  {
    id: 2,
    name: "Small balanced tree",
    input: "root = [2, 1, 3]",
    root: [2, 1, 3],
    expected: [2, 3, 1]
  },
  {
    id: 3,
    name: "Single node",
    input: "root = [1]",
    root: [1],
    expected: [1]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Empty tree",
    input: "root = []",
    root: null,
    expected: null
  },
  {
    id: 5,
    name: "Left skewed tree",
    input: "root = [1, 2, null, 3]",
    root: [1, 2, null, 3],
    expected: [1, null, 2, null, 3]
  },
  {
    id: 6,
    name: "Right skewed tree",
    input: "root = [1, null, 2, null, 3]",
    root: [1, null, 2, null, 3],
    expected: [1, 2, null, 3]
  },
  {
    id: 7,
    name: "Sparse tree",
    input: "root = [1, 2, 3, null, 4, 5]",
    root: [1, 2, 3, null, 4, 5],
    expected: [1, 3, 2, null, 5, 4]
  },
  {
    id: 8,
    name: "LeetCode example",
    input: "root = [3, 9, 20, null, null, 15, 7]",
    root: [3, 9, 20, null, null, 15, 7],
    expected: [3, 20, 9, 7, 15]
  },
  {
    id: 9,
    name: "Mixed values",
    input: "root = [0, -1, 2, null, null, 1, 3]",
    root: [0, -1, 2, null, null, 1, 3],
    expected: [0, 2, -1, 3, 1]
  }
];
