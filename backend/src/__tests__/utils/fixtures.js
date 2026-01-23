/**
 * Test data fixtures for testing
 */

// Sample valid Java code
export const validJavaCode = `
class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        return null;
    }
}
`;

// Sample invalid Java code (syntax error)
export const invalidJavaCode = `
class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        return new int[] { 0, 1 // missing closing brace
    }
}
`;

// Sample wrapper class code
export const wrapperClassCode = `
class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        return null;
    }
}
`;

// Sample standalone class code
export const standaloneClassCode = `
public int[] twoSum(int[] nums, int target) {
    return new int[] { 0, 1 };
}
`;

// Sample test cases for Two Sum
export const twoSumTestCases = [
  {
    id: 1,
    name: "Basic pair",
    nums: [2, 7, 11, 15],
    target: 9,
    expected: [0, 1]
  },
  {
    id: 2,
    name: "Another pair",
    nums: [3, 2, 4],
    target: 6,
    expected: [1, 2]
  }
];

// Sample test cases for LRU Cache
export const lruCacheTestCases = [
  {
    id: 1,
    name: "Basic put and get",
    capacity: 2,
    ttlMillis: 5000,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "get", args: [1], expected: 1 }
    ],
    expected: 1
  },
  {
    id: 2,
    name: "Capacity exceeded",
    capacity: 2,
    ttlMillis: 5000,
    steps: [
      { op: "put", args: [1, 1] },
      { op: "put", args: [2, 2] },
      { op: "put", args: [3, 3] },
      { op: "get", args: [1], expected: -1 }
    ],
    expected: -1
  }
];

// Sample Java execution output
export const sampleJavaOutput = `
TEST_0_ACTUAL:[0, 1]
TEST_0_EXPECTED:[0, 1]
TEST_0_RESULT:PASS
TEST_0_TIME:5
TEST_0_STDOUT:
TEST_1_ACTUAL:[1, 2]
TEST_1_EXPECTED:[1, 2]
TEST_1_RESULT:PASS
TEST_1_TIME:3
TEST_1_STDOUT:
`;

// Sample malformed output
export const malformedOutput = `
TEST_0_ACTUAL:some output
TEST_0_EXPECTED:expected output
TEST_0_RESULT:FAIL
`;

// Sample output with missing test
export const incompleteOutput = `
TEST_0_ACTUAL:[0, 1]
TEST_0_EXPECTED:[0, 1]
TEST_0_RESULT:PASS
TEST_0_TIME:2
TEST_0_STDOUT:
`;

// Sample output with stdout
export const outputWithStdout = `
TEST_0_ACTUAL:result
TEST_0_EXPECTED:result
TEST_0_RESULT:PASS
TEST_0_TIME:1
TEST_0_STDOUT:Debug message
Another line
`;
