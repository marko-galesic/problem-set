// Generate Parentheses test suite
//
// Test cases for generateParenthesis(int n) method
// Returns string[] of well-formed parentheses in lexicographic order

export const runTests = [
  {
    id: 1,
    name: "Single pair",
    input: "n = 1",
    n: 1,
    expected: ["()"]
  },
  {
    id: 2,
    name: "Two pairs",
    input: "n = 2",
    n: 2,
    expected: ["(())", "()()"]
  },
  {
    id: 3,
    name: "Three pairs",
    input: "n = 3",
    n: 3,
    expected: ["((()))", "(()())", "(())()", "()(())", "()()()"]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Zero pairs",
    input: "n = 0",
    n: 0,
    expected: [""]
  },
  {
    id: 5,
    name: "Four pairs",
    input: "n = 4",
    n: 4,
    expected: [
      "(((())))",
      "((()()))",
      "((())())",
      "((()))()",
      "(()(()))",
      "(()()())",
      "(()())()",
      "(())(())",
      "(())()()",
      "()((()))",
      "()(()())",
      "()(())()",
      "()()(())",
      "()()()()"
    ]
  }
];
