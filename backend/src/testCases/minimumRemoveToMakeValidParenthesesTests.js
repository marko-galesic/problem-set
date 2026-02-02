// Minimum Remove to Make Valid Parentheses test suite
//
// Test cases for minimumRemoveToMakeValidParentheses method
// Returns string

export const runTests = [
  {
    "id": 1,
    "name": "Trailing extra paren",
    "input": "s = \"lee(t(c)o)de)\"",
    "s": "lee(t(c)o)de)",
    "expected": "lee(t(c)o)de"
  },
  {
    "id": 2,
    "name": "Single removal",
    "input": "s = \"a)b(c)d\"",
    "s": "a)b(c)d",
    "expected": "ab(c)d"
  },
  {
    "id": 3,
    "name": "All invalid",
    "input": "s = \"))((\"",
    "s": "))((",
    "expected": ""
  }
];

export const submitTests = [
  ...runTests
];
