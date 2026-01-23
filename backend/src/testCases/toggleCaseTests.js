// Toggle Case test suite
//
// Test cases for toggleCase(String s) method
// Returns String

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "AbC"',
    s: "AbC",
    expected: "aBc"
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "abc"',
    s: "abc",
    expected: "ABC"
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "ABC"',
    s: "ABC",
    expected: "abc"
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = "Hi 123!"',
    s: "Hi 123!",
    expected: "hI 123!"
  },
{
    id: 5,
    name: "Case 5",
    input: 's = ""',
    s: "",
    expected: ""
  }
];
