// Contains Digit test suite
//
// Test cases for containsDigit(String s) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "abc"',
    s: "abc",
    expected: false
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "a1c"',
    s: "a1c",
    expected: true
  },
{
    id: 3,
    name: "Case 3",
    input: 's = ""',
    s: "",
    expected: false
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = "123"',
    s: "123",
    expected: true
  },
{
    id: 5,
    name: "Case 5",
    input: 's = "no digits!"',
    s: "no digits!",
    expected: false
  }
];
