// Remove Digits test suite
//
// Test cases for removeDigits(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "a1b2"',
    s: "a1b2",
    expected: "ab"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "123"',
    s: "123",
    expected: ""
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "no digits"',
    s: "no digits",
    expected: "no digits"
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = "a0b"',
    s: "a0b",
    expected: "ab"
  },
{
    id: 5,
    name: "Case 5",
    input: 's = ""',
    s: "",
    expected: ""
  }
];
