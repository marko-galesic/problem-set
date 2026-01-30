// Valid Parentheses with Star test suite
//
// Test cases for validParenthesesWithStar(String s)

export const runTests = [
  {
    "id": 1,
    "name": "Valid with star",
    "input": "s = \"(*))\"",
    "s": "(*))",
    "expected": true
  },
  {
    "id": 2,
    "name": "Star at end",
    "input": "s = \"(()*\"",
    "s": "(()*",
    "expected": true
  },
  {
    "id": 3,
    "name": "Invalid",
    "input": "s = \")*(\"",
    "s": ")*(",
    "expected": false
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Nested",
      "input": "s = \"(*()*)\"",
      "s": "(*()*)",
      "expected": true
    },
    {
      "id": 5,
      "name": "Unbalanced",
      "input": "s = \"(((*\"",
      "s": "(((*",
      "expected": false
    }
];
