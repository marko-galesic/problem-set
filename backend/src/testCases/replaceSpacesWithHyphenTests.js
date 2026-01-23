// Replace Spaces With Hyphen test suite
//
// Test cases for replaceSpacesWithHyphen(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "a b c"',
    s: "a b c",
    expected: "a-b-c"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = " no leading"',
    s: " no leading",
    expected: "-no-leading"
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "trailing "',
    s: "trailing ",
    expected: "trailing-"
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
    input: 's = "two  spaces"',
    s: "two  spaces",
    expected: "two--spaces"
  }
];
