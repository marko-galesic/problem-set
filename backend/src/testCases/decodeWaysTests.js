// Decode Ways test suite
//
// Test cases for numDecodings(s) method
// Returns int

export const runTests = [
  {
    "id": 1,
    "name": "Multiple decodings",
    "input": "s = \"226\"",
    "s": "226",
    "expected": 3
  },
  {
    "id": 2,
    "name": "Simple two digits",
    "input": "s = \"12\"",
    "s": "12",
    "expected": 2
  },
  {
    "id": 3,
    "name": "Leading zero",
    "input": "s = \"06\"",
    "s": "06",
    "expected": 0
  },
  {
    "id": 4,
    "name": "Zeros inside",
    "input": "s = \"2101\"",
    "s": "2101",
    "expected": 1
  }
];

export const submitTests = [
  ...runTests
];
