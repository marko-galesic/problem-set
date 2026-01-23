// Starts With Vowel test suite
//
// Test cases for startsWithVowel(String s) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "Apple"',
    s: "Apple",
    expected: true
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "banana"',
    s: "banana",
    expected: false
  },
{
    id: 3,
    name: "Case 3",
    input: 's = " egg"',
    s: " egg",
    expected: false
  }
];

export const submitTests = [
  ...runTests,

{
    id: 4,
    name: "Case 4",
    input: 's = "Orange"',
    s: "Orange",
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
