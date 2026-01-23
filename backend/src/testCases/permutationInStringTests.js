// Permutation in String test suite
//
// Test cases for checkInclusion(String s1, String s2) method
// Returns boolean: true if s2 contains a permutation of s1

export const runTests = [
  {
    id: 1,
    name: "Basic permutation present",
    input: 's1 = "ab", s2 = "eidbaooo"',
    s1: "ab",
    s2: "eidbaooo",
    expected: true
  },
  {
    id: 2,
    name: "Permutation absent",
    input: 's1 = "ab", s2 = "eidboaoo"',
    s1: "ab",
    s2: "eidboaoo",
    expected: false
  },
  {
    id: 3,
    name: "Permutation present with overlap",
    input: 's1 = "adc", s2 = "dcda"',
    s1: "adc",
    s2: "dcda",
    expected: true
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "s1 longer than s2",
    input: 's1 = "abcd", s2 = "abc"',
    s1: "abcd",
    s2: "abc",
    expected: false
  },
  {
    id: 5,
    name: "Single character match",
    input: 's1 = "a", s2 = "a"',
    s1: "a",
    s2: "a",
    expected: true
  },
  {
    id: 6,
    name: "Single character mismatch",
    input: 's1 = "a", s2 = "b"',
    s1: "a",
    s2: "b",
    expected: false
  },
  {
    id: 7,
    name: "Repeated characters present",
    input: 's1 = "aabc", s2 = "daabca"',
    s1: "aabc",
    s2: "daabca",
    expected: true
  },
  {
    id: 8,
    name: "Repeated characters absent",
    input: 's1 = "aa", s2 = "ab"',
    s1: "aa",
    s2: "ab",
    expected: false
  },
  {
    id: 9,
    name: "Empty s1",
    input: 's1 = "", s2 = "anything"',
    s1: "",
    s2: "anything",
    expected: true
  },
  {
    id: 10,
    name: "Non-overlapping characters",
    input: 's1 = "xyz", s2 = "aaabbbccc"',
    s1: "xyz",
    s2: "aaabbbccc",
    expected: false
  }
];
