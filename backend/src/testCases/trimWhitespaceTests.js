// Trim Whitespace test suite
//
// Test cases for trimWhitespace(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "  hello  "',
    s: "  hello  ",
    expected: "hello"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "   spaced"',
    s: "   spaced",
    expected: "spaced"
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "no trim"',
    s: "no trim",
    expected: "no trim"
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = ""',
    s: "",
    expected: ""
  },
{
    id: 5,
    name: "Case 5",
    input: 's = "  a b  "',
    s: "  a b  ",
    expected: "a b"
  }
];
