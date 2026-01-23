// Remove Spaces test suite
//
// Test cases for removeSpaces(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "a b c"',
    s: "a b c",
    expected: "abc"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "  hi  "',
    s: "  hi  ",
    expected: "hi"
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "no_spaces"',
    s: "no_spaces",
    expected: "no_spaces"
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
    input: 's = " spaced words "',
    s: " spaced words ",
    expected: "spacedwords"
  }
];
