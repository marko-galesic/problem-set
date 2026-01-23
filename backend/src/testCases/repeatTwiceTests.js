// Repeat Twice test suite
//
// Test cases for repeatTwice(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "ab"',
    s: "ab",
    expected: "abab"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = ""',
    s: "",
    expected: ""
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "Hi!"',
    s: "Hi!",
    expected: "Hi!Hi!"
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = "a "',
    s: "a ",
    expected: "a a "
  },
{
    id: 5,
    name: "Case 5",
    input: 's = "Z"',
    s: "Z",
    expected: "ZZ"
  }
];
