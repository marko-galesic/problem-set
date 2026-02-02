// Satisfiability of Equality Equations test suite
//
// Test cases for equationsPossible(String[] equations) method
// Returns boolean

export const runTests = [
  {
    id: 1,
    name: "Contradiction",
    input: 'equations = ["a==b","b!=c","c==a"]',
    equations: ["a==b", "b!=c", "c==a"],
    expected: false
  },
  {
    id: 2,
    name: "No contradiction",
    input: 'equations = ["a==b","b==c","a==c"]',
    equations: ["a==b", "b==c", "a==c"],
    expected: true
  }
];

export const submitTests = [
  ...runTests,
  {
    id: 3,
    name: "Simple inequality",
    input: 'equations = ["a!=b"]',
    equations: ["a!=b"],
    expected: true
  },
  {
    id: 4,
    name: "Equality then inequality",
    input: 'equations = ["a==b","b!=a"]',
    equations: ["a==b", "b!=a"],
    expected: false
  }
];
