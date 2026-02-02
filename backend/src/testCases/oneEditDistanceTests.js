// One Edit Distance test suite
//
// Test cases for oneEditDistance method
// Returns boolean

export const runTests = [
  {
    "id": 1,
    "name": "Single insert",
    "input": "s = \"ab\", t = \"acb\"",
    "s": "ab",
    "t": "acb",
    "expected": true
  },
  {
    "id": 2,
    "name": "Two edits",
    "input": "s = \"cab\", t = \"ad\"",
    "s": "cab",
    "t": "ad",
    "expected": false
  },
  {
    "id": 3,
    "name": "Single replace",
    "input": "s = \"1203\", t = \"1213\"",
    "s": "1203",
    "t": "1213",
    "expected": true
  },
  {
    "id": 4,
    "name": "No edits",
    "input": "s = \"\", t = \"\"",
    "s": "",
    "t": "",
    "expected": false
  }
];

export const submitTests = [
  ...runTests
];
