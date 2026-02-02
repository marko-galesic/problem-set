// Run Length Encode String test suite
//
// Test cases for stringRunLengthEncode method
// Returns string

export const runTests = [
  {
    "id": 1,
    "name": "Basic run",
    "input": "s = \"aaabbc\"",
    "s": "aaabbc",
    "expected": "a3b2c1"
  },
  {
    "id": 2,
    "name": "Empty string",
    "input": "s = \"\"",
    "s": "",
    "expected": ""
  },
  {
    "id": 3,
    "name": "No repeats",
    "input": "s = \"abcd\"",
    "s": "abcd",
    "expected": "a1b1c1d1"
  }
];

export const submitTests = [
  ...runTests
];
