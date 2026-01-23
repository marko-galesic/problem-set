// Longest Common Prefix test suite
//
// Test cases for longestCommonPrefix(String[] strs) method
// Returns String: longest common prefix

export const runTests = [
  {
    id: 1,
    name: "Basic prefix",
    input: 'strs = ["flower", "flow", "flight"]',
    strs: ["flower", "flow", "flight"],
    expected: "fl"
  },
  {
    id: 2,
    name: "No common prefix",
    input: 'strs = ["dog", "racecar", "car"]',
    strs: ["dog", "racecar", "car"],
    expected: ""
  },
  {
    id: 3,
    name: "Single string",
    input: 'strs = ["prefix"]',
    strs: ["prefix"],
    expected: "prefix"
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Longer shared prefix",
    input: 'strs = ["interspecies", "interstellar", "interstate"]',
    strs: ["interspecies", "interstellar", "interstate"],
    expected: "inters"
  },
  {
    id: 5,
    name: "All identical",
    input: 'strs = ["same", "same", "same"]',
    strs: ["same", "same", "same"],
    expected: "same"
  },
  {
    id: 6,
    name: "Contains empty string",
    input: 'strs = ["", "b", "c"]',
    strs: ["", "b", "c"],
    expected: ""
  },
  {
    id: 7,
    name: "Empty array",
    input: "strs = []",
    strs: [],
    expected: ""
  },
  {
    id: 8,
    name: "Prefix is shortest string",
    input: 'strs = ["a", "ab", "abc"]',
    strs: ["a", "ab", "abc"],
    expected: "a"
  }
];
