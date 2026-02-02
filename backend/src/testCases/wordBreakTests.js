// Word Break test suite
//
// Test cases for wordBreak(s, wordDict) method
// Returns boolean

export const runTests = [
  {
    "id": 1,
    "name": "Simple split",
    "input": "s = \"leetcode\", wordDict = [\"leet\", \"code\"]",
    "s": "leetcode",
    "wordDict": [
      "leet",
      "code"
    ],
    "expected": true
  },
  {
    "id": 2,
    "name": "Repeated word",
    "input": "s = \"applepenapple\", wordDict = [\"apple\", \"pen\"]",
    "s": "applepenapple",
    "wordDict": [
      "apple",
      "pen"
    ],
    "expected": true
  },
  {
    "id": 3,
    "name": "No valid segmentation",
    "input": "s = \"catsandog\", wordDict = [\"cats\", \"dog\", \"sand\", \"and\", \"cat\"]",
    "s": "catsandog",
    "wordDict": [
      "cats",
      "dog",
      "sand",
      "and",
      "cat"
    ],
    "expected": false
  },
  {
    "id": 4,
    "name": "Multiple choices",
    "input": "s = \"aaaaaaa\", wordDict = [\"aaaa\", \"aaa\"]",
    "s": "aaaaaaa",
    "wordDict": [
      "aaaa",
      "aaa"
    ],
    "expected": true
  }
];

export const submitTests = [
  ...runTests
];
