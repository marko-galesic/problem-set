// Replace Words test suite
//
// Test cases for replaceWords(String[] dictionary, String sentence) method
// Returns String

export const runTests = [
  {
    id: 1,
    name: "Classic replacement",
    input: 'dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"',
    dictionary: ["cat", "bat", "rat"],
    sentence: "the cattle was rattled by the battery",
    expected: "the cat was rat by the bat"
  },
  {
    id: 2,
    name: "No replacements",
    input: 'dictionary = ["a"], sentence = "hello world"',
    dictionary: ["a"],
    sentence: "hello world",
    expected: "hello world"
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Multiple roots, choose shortest",
    input: 'dictionary = ["a","ab","abc"], sentence = "abc abacus"',
    dictionary: ["a", "ab", "abc"],
    sentence: "abc abacus",
    expected: "a a"
  },
  {
    id: 4,
    name: "Single word",
    input: 'dictionary = ["blue"], sentence = "blueberry"',
    dictionary: ["blue"],
    sentence: "blueberry",
    expected: "blue"
  }
];
