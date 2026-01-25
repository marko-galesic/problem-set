// Remove Consonants test suite
//
// Test cases for removeConsonants(String s) method
// Returns string

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "Hello"',
    s: "Hello",
    expected: "eo"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "abc"',
    s: "abc",
    expected: "a"
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "AEIOU"',
    s: "AEIOU",
    expected: "AEIOU"
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = "xyz"',
    s: "xyz",
    expected: ""
  },
{
    id: 5,
    name: "Case 5",
    input: 's = "b2e!"',
    s: "b2e!",
    expected: "2e!"
  }
];
