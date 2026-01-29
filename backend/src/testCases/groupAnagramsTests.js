// Group Anagrams test suite
//
// Test cases for groupAnagrams(String[] strs) method
// Output order does not matter for groups or within each group.

export const runTests = [
  {
    id: 1,
    name: "Example 1",
    input: "strs = [\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]",
    strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
    expected: [
      ["bat"],
      ["nat", "tan"],
      ["ate", "eat", "tea"]
    ]
  },
  {
    id: 2,
    name: "Example 2",
    input: "strs = [\"\"]",
    strs: [""],
    expected: [[""]]
  },
  {
    id: 3,
    name: "Example 3",
    input: "strs = [\"a\"]",
    strs: ["a"],
    expected: [["a"]]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 4,
    name: "Duplicates and multiple groups",
    input: "strs = [\"ab\", \"ba\", \"ab\", \"abc\", \"bca\", \"cab\"]",
    strs: ["ab", "ba", "ab", "abc", "bca", "cab"],
    expected: [
      ["ab", "ba", "ab"],
      ["abc", "bca", "cab"]
    ]
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
      ["listen", "silent", "enlist", "inlets"],
      ["google"]
    ]
  }
];
