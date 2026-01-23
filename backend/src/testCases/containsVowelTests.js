// Contains Vowel test suite
//
// Test cases for containsVowel(String s) method
// Returns boolean

export const runTests = [
{
    id: 1,
    name: "Case 1",
    input: 's = "rhythm"',
    s: "rhythm",
    expected: false
  },
{
    id: 2,
    name: "Case 2",
    input: 's = "sky"',
    s: "sky",
    expected: false
  },
{
    id: 3,
    name: "Case 3",
    input: 's = "apple"',
    s: "apple",
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
    input: 's = "HELLO"',
    s: "HELLO",
    expected: true
  }
];
