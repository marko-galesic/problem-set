// Is All Lowercase test suite
//
// Test cases for isAllLowercase(String s) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "abc"',
    s: "abc",
    expected: true
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "aBc"',
    s: "aBc",
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
    input: 's = "a1!"',
    s: "a1!",
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
