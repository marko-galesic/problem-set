// Is All Uppercase test suite
//
// Test cases for isAllUppercase(String s) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "ABC"',
    s: "ABC",
    expected: true
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "AbC"',
    s: "AbC",
    expected: false
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "123"',
    s: "123",
    expected: false
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = "A1!"',
    s: "A1!",
    expected: true
  },
{
    id: 5,
    name: "Case 5",
    input: 's = ""',
    s: "",
    expected: false
  }
];
