// Valid Parentheses test suite
//
// Test cases for isValid(String s) method
// Returns boolean: true if parentheses are valid, false otherwise

export const runTests = [
  {
    id: 1,
    name: "Simple valid parentheses",
    input: 's = "()"',
    s: "()",
    expected: true
  },
  {
    id: 2,
    name: "Invalid mismatched brackets",
    input: 's = "(]"',
    s: "(]",
    expected: false
  },
  {
    id: 3,
    name: "Multiple bracket types valid",
    input: 's = "()[]{}"',
    s: "()[]{}",
    expected: true
  }
];

export const submitTests = [
  ...runTests,
  
  {
    id: 4,
    name: "Empty string",
    input: 's = ""',
    s: "",
    expected: true
  },
  {
    id: 5,
    name: "Nested brackets valid",
    input: 's = "{[]}"',
    s: "{[]}",
    expected: true
  },
  {
    id: 6,
    name: "Invalid order",
    input: 's = "([)]"',
    s: "([)]",
    expected: false
  },
  {
    id: 7,
    name: "Single closing bracket",
    input: 's = "]"',
    s: "]",
    expected: false
  },
  {
    id: 8,
    name: "Single opening bracket",
    input: 's = "("',
    s: "(",
    expected: false
  },
  {
    id: 9,
    name: "Complex nested valid",
    input: 's = "([{}])"',
    s: "([{}])",
    expected: true
  },
  {
    id: 10,
    name: "Multiple pairs valid",
    input: 's = "()()()"',
    s: "()()()",
    expected: true
  },
  {
    id: 11,
    name: "Mixed nested valid",
    input: 's = "({[]})"',
    s: "({[]})",
    expected: true
  },
  {
    id: 12,
    name: "Wrong closing bracket type",
    input: 's = "([})"',
    s: "([})",
    expected: false
  },
  {
    id: 13,
    name: "Long valid string",
    input: 's = "((((()))))"',
    s: "((((()))))",
    expected: true
  },
  {
    id: 14,
    name: "Unmatched closing bracket",
    input: 's = "())"',
    s: "())",
    expected: false
  }
];
