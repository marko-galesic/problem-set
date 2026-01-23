// Validate Binary Search Tree test suite
//
// Test cases for isValidBST(TreeNode root) method
// Returns boolean: whether the tree is a valid BST
// Test cases use level-order array representation with nulls for missing nodes

export const runTests = [
  {
    id: 1,
    name: "Simple valid BST",
    input: "root = [2, 1, 3]",
    root: [2, 1, 3],
    expected: true
  },
  {
    id: 2,
    name: "Classic invalid BST",
    input: "root = [5, 1, 4, null, null, 3, 6]",
    root: [5, 1, 4, null, null, 3, 6],
    expected: false
  },
  {
    id: 3,
    name: "Single node",
    input: "root = [1]",
    root: [1],
    expected: true
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Empty tree",
    input: "root = []",
    root: null,
    expected: true
  },
  {
    id: 5,
    name: "Duplicate values not allowed",
    input: "root = [2, 2, 3]",
    root: [2, 2, 3],
    expected: false
  },
  {
    id: 6,
    name: "Right subtree violates root bound",
    input: "root = [10, 5, 15, null, null, 6, 20]",
    root: [10, 5, 15, null, null, 6, 20],
    expected: false
  },
  {
    id: 7,
    name: "Valid BST with negatives",
    input: "root = [0, -3, 9, -10, null, 5]",
    root: [0, -3, 9, -10, null, 5],
    expected: true
  },
  {
    id: 8,
    name: "Valid balanced BST",
    input: "root = [3, 1, 5, 0, 2, 4, 6]",
    root: [3, 1, 5, 0, 2, 4, 6],
    expected: true
  },
  {
    id: 9,
    name: "Right subtree has smaller value",
    input: "root = [5, 4, 6, null, null, 3, 7]",
    root: [5, 4, 6, null, null, 3, 7],
    expected: false
  }
];
