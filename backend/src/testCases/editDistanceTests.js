// Edit Distance test suite
//
// Test cases for editDistance(String word1, String word2)

export const runTests = [
  {
    "id": 1,
    "name": "Horse to ros",
    "input": "word1 = \"horse\", word2 = \"ros\"",
    "word1": "horse",
    "word2": "ros",
    "expected": 3
  },
  {
    "id": 2,
    "name": "Intention to execution",
    "input": "word1 = \"intention\", word2 = \"execution\"",
    "word1": "intention",
    "word2": "execution",
    "expected": 5
  },
  {
    "id": 3,
    "name": "Empty to abc",
    "input": "word1 = \"\", word2 = \"abc\"",
    "word1": "",
    "word2": "abc",
    "expected": 3
  }
];

export const submitTests = [
  ...runTests,
  {
      "id": 4,
      "name": "Same",
      "input": "word1 = \"abc\", word2 = \"abc\"",
      "word1": "abc",
      "word2": "abc",
      "expected": 0
    },
    {
      "id": 5,
      "name": "Kitten to sitting",
      "input": "word1 = \"kitten\", word2 = \"sitting\"",
      "word1": "kitten",
      "word2": "sitting",
      "expected": 3
    }
];
