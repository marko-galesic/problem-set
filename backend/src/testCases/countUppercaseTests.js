// Count Uppercase test suite
//
// Test cases for countUppercase(String s) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "AbC"',
    s: "AbC",
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
    input: 's = "ABC"',
    s: "ABC",
    expected: 3
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = "A1B2"',
    s: "A1B2",
    expected: 2
  },
{
    id: 5,
    name: "Case 5",
    input: 's = ""',
    s: "",
    expected: 0
  }
];
