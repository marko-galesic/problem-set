// Top K Frequent Words test suite
//
// Test cases for topKFrequent(String[] words, int k) method
// Returns String[] with the k most frequent words

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "words = [\"i\", \"love\", \"leetcode\", \"i\", \"love\", \"coding\"], k = 2",
    words: ["i", "love", "leetcode", "i", "love", "coding"],
    k: 2,
    expected: ["i", "love"]
  },
  {
    id: 2,
    name: "Tie uses lex order",
    input: "words = [\"b\", \"a\", \"b\", \"a\", \"c\"], k = 2",
    words: ["b", "a", "b", "a", "c"],
    k: 2,
    expected: ["a", "b"]
  },
  {
    id: 3,
    name: "Single unique word",
    input: "words = [\"z\", \"z\", \"z\"], k = 1",
    words: ["z", "z", "z"],
    k: 1,
    expected: ["z"]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "k equals unique count",
    input: "words = [\"the\", \"day\", \"is\", \"sunny\", \"the\", \"the\", \"the\", \"sunny\", \"is\", \"is\"], k = 4",
    words: ["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"],
    k: 4,
    expected: ["the", "is", "sunny", "day"]
  },
  {
    id: 5,
    name: "Multiple ties",
    input: "words = [\"aa\", \"ab\", \"ac\", \"aa\", \"ab\", \"ad\"], k = 3",
    words: ["aa", "ab", "ac", "aa", "ab", "ad"],
    k: 3,
    expected: ["aa", "ab", "ac"]
  },
  {
    id: 6,
    name: "Mixed frequencies",
    input: "words = [\"x\", \"y\", \"x\", \"y\", \"z\", \"z\", \"z\", \"a\"], k = 3",
    words: ["x", "y", "x", "y", "z", "z", "z", "a"],
    k: 3,
    expected: ["z", "x", "y"]
  }
];
