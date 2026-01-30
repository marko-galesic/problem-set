// Longest Palindromic Substring test suite
//
// Test cases for longestPalindrome method

export const runTests = [
  {
    "id": 1,
    "name": "Odd palindrome",
    "input": "s = \"babad\"",
    "s": "babad",
    "expected": "bab"
  },
  {
    "id": 2,
    "name": "Even palindrome",
    "input": "s = \"cbbd\"",
    "s": "cbbd",
    "expected": "bb"
  },
  {
    "id": 3,
    "name": "Single char",
    "input": "s = \"a\"",
    "s": "a",
    "expected": "a"
  }
];

export const submitTests = [
  {
    "id": 4,
    "name": "Two chars",
    "input": "s = \"ac\"",
    "s": "ac",
    "expected": "a"
  },
  {
    "id": 5,
    "name": "Long palindrome",
    "input": "s = \"forgeeksskeegfor\"",
    "s": "forgeeksskeegfor",
    "expected": "geeksskeeg"
  },
  {
    "id": 6,
    "name": "Full string",
    "input": "s = \"abccba\"",
    "s": "abccba",
    "expected": "abccba"
  }
];
