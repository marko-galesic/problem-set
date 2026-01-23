// Group Anagrams test suite
//
// Test cases for groupAnagrams(String[] strs) method
// Returns String[][] with each group sorted and groups ordered lexicographically

export const runTests = [
  {
    id: 1,
    name: "Basic example",
    input: "strs = [\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]",
    strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
    expected: [
      ["ate", "eat", "tea"],
      ["bat"],
      ["nat", "tan"]
    ]
  },
  {
    id: 2,
    name: "Duplicates and multiple groups",
    input: "strs = [\"ab\", \"ba\", \"ab\", \"abc\", \"bca\", \"cab\"]",
    strs: ["ab", "ba", "ab", "abc", "bca", "cab"],
    expected: [
      ["ab", "ab", "ba"],
      ["abc", "bca", "cab"]
    ]
  },
  {
    id: 3,
    name: "Single element",
    input: "strs = [\"a\"]",
    strs: ["a"],
    expected: [["a"]]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Empty input",
    input: "strs = []",
    strs: [],
    expected: []
  },
  {
    id: 5,
    name: "Includes empty strings",
    input: "strs = [\"\", \"b\", \"\"]",
    strs: ["", "b", ""],
    expected: [
      ["", ""],
      ["b"]
    ]
  },
  {
    id: 6,
    name: "Longer words",
    input: "strs = [\"listen\", \"silent\", \"enlist\", \"inlets\", \"google\"]",
    strs: ["listen", "silent", "enlist", "inlets", "google"],
    expected: [
      ["enlist", "inlets", "listen", "silent"],
      ["google"]
    ]
  }
];
