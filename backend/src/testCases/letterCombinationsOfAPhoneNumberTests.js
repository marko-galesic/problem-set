// Letter Combinations of a Phone Number test suite
//
// Test cases for letterCombinations(String digits) method
// Returns string[]

export const runTests = [
  {
    id: 1,
    name: "Two digits",
    input: 'digits = "23"',
    digits: "23",
    expected: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
  },
  {
    id: 2,
    name: "Single digit with four letters",
    input: 'digits = "7"',
    digits: "7",
    expected: ["p", "q", "r", "s"]
  },
  {
    id: 3,
    name: "Empty input",
    input: 'digits = ""',
    digits: "",
    expected: []
  }
];

export const submitTests = [
  ...runTests,

  {
    id: 4,
    name: "Single digit",
    input: 'digits = "2"',
    digits: "2",
    expected: ["a", "b", "c"]
  },
  {
    id: 5,
    name: "Single digit at end of mapping",
    input: 'digits = "9"',
    digits: "9",
    expected: ["w", "x", "y", "z"]
  },
  {
    id: 6,
    name: "Two digits with four letters each",
    input: 'digits = "79"',
    digits: "79",
    expected: [
      "pw", "px", "py", "pz",
      "qw", "qx", "qy", "qz",
      "rw", "rx", "ry", "rz",
      "sw", "sx", "sy", "sz"
    ]
  },
  {
    id: 7,
    name: "Three digits",
    input: 'digits = "234"',
    digits: "234",
    expected: [
      "adg", "adh", "adi", "aeg", "aeh", "aei", "afg", "afh", "afi",
      "bdg", "bdh", "bdi", "beg", "beh", "bei", "bfg", "bfh", "bfi",
      "cdg", "cdh", "cdi", "ceg", "ceh", "cei", "cfg", "cfh", "cfi"
    ]
  }
];
