// Add and Search Word test suite
//
// Test cases for wordDictionaryOps(String[] ops, String[] words) method
// Returns int[] results for search operations

export const runTests = [
  {
    id: 1,
    name: "Wildcard basics",
    input: 'ops = ["add","add","add","search","search","search"], words = ["bad","dad","mad","pad","bad",".ad"]',
    ops: ["add", "add", "add", "search", "search", "search"],
    words: ["bad", "dad", "mad", "pad", "bad", ".ad"],
    expected: [0, 1, 1]
  },
  {
    id: 2,
    name: "Length-sensitive search",
    input: 'ops = ["add","search","search"], words = ["apple","app","a..le"]',
    ops: ["add", "search", "search"],
    words: ["apple", "app", "a..le"],
    expected: [0, 1]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "All wildcards",
    input: 'ops = ["add","add","search","search"], words = ["cat","dog","...","..t"]',
    ops: ["add", "add", "search", "search"],
    words: ["cat", "dog", "...", "..t"],
    expected: [1, 1]
  },
  {
    id: 4,
    name: "No matches",
    input: 'ops = ["add","search"], words = ["bird","b..g"]',
    ops: ["add", "search"],
    words: ["bird", "b..g"],
    expected: [0]
  }
];
