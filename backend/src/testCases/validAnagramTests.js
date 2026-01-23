// Valid Anagram test suite
//
// Test cases for isAnagram(String s, String t) method
// Returns boolean: true if t is an anagram of s

export const runTests = [
  {
    id: 1,
    name: "Classic anagram",
    input: 's = "anagram", t = "nagaram"',
    s: "anagram",
    t: "nagaram",
    expected: true
  },
  {
    id: 2,
    name: "Not an anagram",
    input: 's = "rat", t = "car"',
    s: "rat",
    t: "car",
    expected: false
  },
  {
    id: 3,
    name: "Single letter",
    input: 's = "a", t = "a"',
    s: "a",
    t: "a",
    expected: true
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Different lengths",
    input: 's = "ab", t = "abc"',
    s: "ab",
    t: "abc",
    expected: false
  },
  {
    id: 5,
    name: "Same letters different order",
    input: 's = "ab", t = "ba"',
    s: "ab",
    t: "ba",
    expected: true
  },
  {
    id: 6,
    name: "Repeated letters mismatch",
    input: 's = "aacc", t = "ccac"',
    s: "aacc",
    t: "ccac",
    expected: false
  },
  {
    id: 7,
    name: "Empty strings",
    input: 's = "", t = ""',
    s: "",
    t: "",
    expected: true
  },
  {
    id: 8,
    name: "Repeated letters match",
    input: 's = "aabb", t = "bbaa"',
    s: "aabb",
    t: "bbaa",
    expected: true
  },
  {
    id: 9,
    name: "Different character",
    input: 's = "hello", t = "bello"',
    s: "hello",
    t: "bello",
    expected: false
  }
];
