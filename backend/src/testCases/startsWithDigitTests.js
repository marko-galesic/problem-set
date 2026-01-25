// Starts With Digit test suite
//
// Test cases for startsWithDigit(String s) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "1test"',
    s: "1test",
    expected: true
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "test"',
    s: "test",
    expected: false
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "9"',
    s: "9",
    expected: true
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = ""',
    s: "",
    expected: false
  },
{
    id: 5,
    name: "Case 5",
    input: 's = " 7"',
    s: " 7",
    expected: false
  }
];
