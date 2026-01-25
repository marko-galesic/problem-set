// Replace Spaces With Plus test suite
//
// Test cases for replaceSpacesWithPlus(String s) method
// Returns string

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "a b"',
    s: "a b",
    expected: "a+b"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "abc"',
    s: "abc",
    expected: "abc"
  },
{
    id: 3,
    name: "Case 3",
    input: 's = " "',
    s: " ",
    expected: "+"
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
    input: 's = "a  b"',
    s: "a  b",
    expected: "a++b"
  }
];
