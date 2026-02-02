// Simplify Path test suite
//
// Test cases for simplifyPath method
// Returns string

export const runTests = [
  {
    "id": 1,
    "name": "Trailing slash",
    "input": "path = \"/home/\"",
    "path": "/home/",
    "expected": "/home"
  },
  {
    "id": 2,
    "name": "Parent and current",
    "input": "path = \"/a/./b/../../c/\"",
    "path": "/a/./b/../../c/",
    "expected": "/c"
  },
  {
    "id": 3,
    "name": "Above root",
    "input": "path = \"/../\"",
    "path": "/../",
    "expected": "/"
  },
  {
    "id": 4,
    "name": "Double slashes",
    "input": "path = \"/home//foo/\"",
    "path": "/home//foo/",
    "expected": "/home/foo"
  }
];

export const submitTests = [
  ...runTests
];
