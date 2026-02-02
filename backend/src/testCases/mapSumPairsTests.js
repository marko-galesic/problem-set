// Map Sum Pairs test suite
//
// Test cases for mapSumOps(String[] ops, String[] keys, int[] vals) method
// Returns int[]

export const runTests = [
  {
    id: 1,
    name: "Basic inserts and sums",
    input: 'ops = ["insert","insert","sum","insert","sum"], keys = ["apple","app","ap","app","ap"], vals = [3,2,0,5,0]',
    ops: ["insert", "insert", "sum", "insert", "sum"],
    keys: ["apple", "app", "ap", "app", "ap"],
    vals: [3, 2, 0, 5, 0],
    expected: [5, 8]
  },
  {
    id: 2,
    name: "Prefix not found",
    input: 'ops = ["insert","sum"], keys = ["cat","dog"], vals = [7,0]',
    ops: ["insert", "sum"],
    keys: ["cat", "dog"],
    vals: [7, 0],
    expected: [0]
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Overwrite existing key",
    input: 'ops = ["insert","sum","insert","sum"], keys = ["a","a","a","a"], vals = [1,0,5,0]',
    ops: ["insert", "sum", "insert", "sum"],
    keys: ["a", "a", "a", "a"],
    vals: [1, 0, 5, 0],
    expected: [1, 5]
  },
  {
    id: 4,
    name: "Multiple prefixes",
    input: 'ops = ["insert","insert","sum","sum"], keys = ["ab","ac","a","ab"], vals = [2,3,0,0]',
    ops: ["insert", "insert", "sum", "sum"],
    keys: ["ab", "ac", "a", "ab"],
    vals: [2, 3, 0, 0],
    expected: [5, 2]
  }
];
