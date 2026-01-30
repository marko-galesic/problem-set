// Rotate String K test suite
//
// Test cases for rotateStringK(String s, int k)

export const runTests = [
  {
    "id": 1,
    "name": "Rotate by 2",
    "input": "s = \"abcdef\", k = 2",
    "s": "abcdef",
    "k": 2,
    "expected": "efabcd"
  },
  {
    "id": 2,
    "name": "Full rotation",
    "input": "s = \"hello\", k = 5",
    "s": "hello",
    "k": 5,
    "expected": "hello"
  },
  {
    "id": 3,
    "name": "k larger than length",
    "input": "s = \"rotation\", k = 10",
    "s": "rotation",
    "k": 10,
    "expected": "onrotati"
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Empty string",
      "input": "s = \"\", k = 3",
      "s": "",
      "k": 3,
      "expected": ""
    },
    {
      "id": 5,
      "name": "Single char large k",
      "input": "s = \"a\", k = 100",
      "s": "a",
      "k": 100,
      "expected": "a"
    }
];
