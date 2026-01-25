// Count Digits In String test suite
//
// Test cases for countDigitsInString(String s) method
// Returns int

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "a1b2"',
    s: "a1b2",
    expected: 2
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "123"',
    s: "123",
    expected: 3
  },
{
    id: 3,
    name: "Case 3",
    input: 's = ""',
    s: "",
    expected: 0
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = "no digits"',
    s: "no digits",
    expected: 0
  },
{
    id: 5,
    name: "Case 5",
    input: 's = "9 lives"',
    s: "9 lives",
    expected: 1
  }
];
