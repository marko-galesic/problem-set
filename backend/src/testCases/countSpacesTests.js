// Count Spaces test suite
//
// Test cases for countSpaces(String s) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "a b c"',
    s: "a b c",
    expected: 2
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "abc"',
    s: "abc",
    expected: 0
  },
{
    id: 3,
    name: "Case 3",
    input: 's = " "',
    s: " ",
    expected: 1
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = ""',
    s: "",
    expected: 0
  },
{
    id: 5,
    name: "Case 5",
    input: 's = "a  b"',
    s: "a  b",
    expected: 2
  }
];
