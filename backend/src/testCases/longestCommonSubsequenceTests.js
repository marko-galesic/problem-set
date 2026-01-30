// Longest Common Subsequence test suite
//
// Test cases for longestCommonSubsequence(String text1, String text2)

export const runTests = [
  {
    "id": 1,
    "name": "Example",
    "input": "text1 = \"abcde\", text2 = \"ace\"",
    "text1": "abcde",
    "text2": "ace",
    "expected": 3
  },
  {
    "id": 2,
    "name": "Same strings",
    "input": "text1 = \"abc\", text2 = \"abc\"",
    "text1": "abc",
    "text2": "abc",
    "expected": 3
  },
  {
    "id": 3,
    "name": "No common",
    "input": "text1 = \"abc\", text2 = \"def\"",
    "text1": "abc",
    "text2": "def",
    "expected": 0
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Classic",
      "input": "text1 = \"AGGTAB\", text2 = \"GXTXAYB\"",
      "text1": "AGGTAB",
      "text2": "GXTXAYB",
      "expected": 4
    },
    {
      "id": 5,
      "name": "Empty",
      "input": "text1 = \"\", text2 = \"abc\"",
      "text1": "",
      "text2": "abc",
      "expected": 0
    }
];
