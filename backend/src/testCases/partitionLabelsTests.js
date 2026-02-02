// Partition Labels test suite
//
// Test cases for partitionLabels(s) method
// Returns int[]

export const runTests = [
  {
    "id": 1,
    "name": "Multiple partitions",
    "input": "s = \"ababcbacadefegdehijhklij\"",
    "s": "ababcbacadefegdehijhklij",
    "expected": [
      9,
      7,
      8
    ]
  },
  {
    "id": 2,
    "name": "Single partition",
    "input": "s = \"eccbbbbdec\"",
    "s": "eccbbbbdec",
    "expected": [
      10
    ]
  },
  {
    "id": 3,
    "name": "Distinct letters",
    "input": "s = \"abc\"",
    "s": "abc",
    "expected": [
      1,
      1,
      1
    ]
  },
  {
    "id": 4,
    "name": "Trailing unique letter",
    "input": "s = \"aaab\"",
    "s": "aaab",
    "expected": [
      3,
      1
    ]
  }
];

export const submitTests = [
  ...runTests
];
