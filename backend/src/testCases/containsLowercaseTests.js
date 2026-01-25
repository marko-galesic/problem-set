// Contains Lowercase test suite
//
// Test cases for containsLowercase(String s) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "HELLO"',
    s: "HELLO",
    expected: false
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "Hello"',
    s: "Hello",
    expected: true
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "abc"',
    s: "abc",
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
    input: 's = "123"',
    s: "123",
    expected: false
  }
];
