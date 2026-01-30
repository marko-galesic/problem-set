// Reverse Words in String test suite
//
// Test cases for reverseWordsInString(String s)

export const runTests = [
  {
    "id": 1,
    "name": "Multiple words",
    "input": "s = \"the sky is blue\"",
    "s": "the sky is blue",
    "expected": "blue is sky the"
  },
  {
    "id": 2,
    "name": "Two words",
    "input": "s = \"hello world\"",
    "s": "hello world",
    "expected": "world hello"
  },
  {
    "id": 3,
    "name": "Single letters",
    "input": "s = \"a b c\"",
    "s": "a b c",
    "expected": "c b a"
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Single word",
      "input": "s = \"single\"",
      "s": "single",
      "expected": "single"
    },
    {
      "id": 5,
      "name": "Empty string",
      "input": "s = \"\"",
      "s": "",
      "expected": ""
    }
];
