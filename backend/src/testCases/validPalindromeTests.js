// Valid Palindrome test suite
//
// Test cases for isPalindrome(String s) method
// Returns boolean: true if valid palindrome, false otherwise

export const runTests = [
  {
    id: 1,
    name: "Classic valid palindrome",
    input: 's = "A man, a plan, a canal: Panama"',
    s: "A man, a plan, a canal: Panama",
    expected: true
  },
  {
    id: 2,
    name: "Not a palindrome",
    input: 's = "race a car"',
    s: "race a car",
    expected: false
  },
  {
    id: 3,
    name: "Only spaces",
    input: 's = " "',
    s: " ",
    expected: true
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Empty string",
    input: 's = ""',
    s: "",
    expected: true
  },
  {
    id: 5,
    name: "Single letter",
    input: 's = "a"',
    s: "a",
    expected: true
  },
  {
    id: 6,
    name: "Case insensitive",
    input: 's = "Aa"',
    s: "Aa",
    expected: true
  },
  {
    id: 7,
    name: "Numbers and letters",
    input: 's = "0P"',
    s: "0P",
    expected: false
  },
  {
    id: 8,
    name: "Palindrome with punctuation",
    input: 's = "No \\"x\\" in Nixon"',
    s: 'No "x" in Nixon',
    expected: true
  },
  {
    id: 9,
    name: "Non-alphanumeric ignored",
    input: 's = "ab@a"',
    s: "ab@a",
    expected: true
  },
  {
    id: 10,
    name: "Mixed symbols not palindrome",
    input: 's = "abc#d"',
    s: "abc#d",
    expected: false
  }
];
