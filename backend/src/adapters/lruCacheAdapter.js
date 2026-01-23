/**
 * Adapter for LRU Cache with TTL challenge
 * Handles LRUCache class with get() and put() methods
 */

// Check if user code already defines LRUCache class
function checkUserDefinedClasses(userCode) {
  if (!userCode) return { hasLRUCache: false };
  
  const lruCachePattern = /\bclass\s+LRUCache\b/;
  const hasLRUCache = lruCachePattern.test(userCode);
  
  return { hasLRUCache };
}

// Build expected result code (for get operations, expected is an integer)
function buildExpectedCode(expected, indent = '        ', varName = 'expected') {
  if (expected === undefined || expected === null) {
    return `${indent}Integer ${varName} = -1;\n`;
  }
  return `${indent}Integer ${varName} = ${expected};\n`;
}

// Extract expected value from LRU Cache test case
// (extracts from last get() operation in steps)
function extractLRUExpected(testCase) {
  if (!testCase.steps || !Array.isArray(testCase.steps)) {
    return -1;
  }
  
  // Find the last get() operation and return its expected value
  for (let i = testCase.steps.length - 1; i >= 0; i--) {
    const step = testCase.steps[i];
    if (step.op === 'get' && step.expected !== undefined) {
      return step.expected;
    }
  }
  
  // If no get() with expected, return -1
  return -1;
}

export default {
  // Extract input from test case
  extractInput: (testCase) => {
    return {
      capacity: testCase.capacity !== undefined ? testCase.capacity : 2,
      ttlMillis: testCase.ttlMillis !== undefined ? testCase.ttlMillis : null,
      steps: testCase.steps || []
    };
  },

  // Build Java code that creates the expected result
  // For LRU Cache, expected is extracted from the last get() operation
  buildExpectedCode: (expected, indent = '        ', varName = 'expected') => {
    return buildExpectedCode(expected, indent, varName);
  },

  // Generate Java code to serialize result (just the integer return value)
  generateSerializer: () => {
    return `    // Serialize result (integer return value from get())
    private static String serializeResult(Integer result) {
        return result == null ? "null" : String.valueOf(result);
    }`;
  },

  // Generate Java code to invoke the user's method
  // For LRU Cache, this generates code that creates a cache and executes all steps
  // The executor calls this with a variable name and expects it to set 'actual'
  generateInvocation: (cacheVar) => {
    // The executor provides 'i' as the test case index
    // We'll use helper methods to get test case data
    return `                    // Reset clock at start of each test
                    TestClock.reset();
                    
                    int capacity = getTestCapacity(i);
                    long ttlMillis = getTestTTL(i);
                    java.util.List<Step> steps = getTestSteps(i);
                    
                    // Check if we need time control
                    boolean hasTimeControl = false;
                    for (Step step : steps) {
                        if (step.at != null) {
                            hasTimeControl = true;
                            break;
                        }
                    }
                    
                    // Set up mock clock if time control is needed
                    long baseTime = System.currentTimeMillis();
                    if (hasTimeControl) {
                        TestClock.setCurrentTime(baseTime);
                    }
                    
                    LRUCache cache = new LRUCache(capacity, ttlMillis);
                    actual = -1;
                    
                    // Execute steps with time control
                    for (Step step : steps) {
                        // Set current time if step has 'at' timestamp
                        if (step.at != null) {
                            TestClock.setCurrentTime(baseTime + step.at);
                        }
                        
                        if ("put".equals(step.op)) {
                            cache.put(step.args[0], step.args[1]);
                        } else if ("get".equals(step.op)) {
                            actual = cache.get(step.args[0]);
                        }
                    }`;
  },

  // Generate helper methods for test input
  // For LRU Cache, we need to provide capacity and steps for each test case
  generateInputHelpers: (testCases) => {
    // Generate Step class
    let code = `    // Step class for test operations
    static class Step {
        String op;
        int[] args;
        Long at;  // Timestamp for time-controlled operations (null if not specified)
        
        Step(String op, int[] args, Long at) {
            this.op = op;
            this.args = args;
            this.at = at;
        }
    }
    
    // Helper to get capacity for a test case
    private static int getTestCapacity(int index) {
        int[] capacities = {
${testCases.map(tc => `            ${tc.capacity !== undefined ? tc.capacity : 2}`).join(',\n')}
        };
        return capacities[index];
    }
    
    // Helper to get TTL for a test case (default: 5 minutes if not specified)
    private static long getTestTTL(int index) {
        long[] ttls = {
${testCases.map(tc => `            ${tc.ttlMillis !== undefined ? tc.ttlMillis + 'L' : '5L * 60 * 1000'}`).join(',\n')}
        };
        return ttls[index];
    }
    
    // Helper to get steps for a test case
    private static java.util.List<Step> getTestSteps(int index) {
        @SuppressWarnings("unchecked")
        java.util.List<Step>[] allSteps = new java.util.List[] {
`;
    
    // Generate steps for each test case
    testCases.forEach((testCase, idx) => {
      const steps = testCase.steps || [];
      if (steps.length === 0) {
        code += `            java.util.Collections.emptyList()`;
      } else {
        code += `            java.util.Arrays.asList(\n`;
        
        const stepCodes = steps.map((step) => {
          const atValue = step.at !== undefined ? `${step.at}L` : 'null';
          if (step.op === 'put') {
            return `                new Step("put", new int[]{${step.args[0]}, ${step.args[1]}}, ${atValue})`;
          } else if (step.op === 'get') {
            return `                new Step("get", new int[]{${step.args[0]}}, ${atValue})`;
          }
          return null;
        }).filter(s => s !== null);
        
        code += stepCodes.join(',\n');
        code += `\n            )`;
      }
      if (idx < testCases.length - 1) {
        code += ',\n';
      }
    });
    
    code += `\n        };\n`;
    code += `        return allSteps[index];\n`;
    code += `    }\n`;
    
    return code;
  },

  // Check if user code defines required classes/types
  checkUserDefinedClasses: checkUserDefinedClasses,

  // Generate required helper classes/types if not in user code
  generateHelperClasses: (hasUserDefined) => {
    // TestClock is created as a separate top-level file by the executor,
    // so no helper classes are needed here.
    return '';
  },

  // Get the return type name for this challenge
  // Use Integer (boxed) instead of int (primitive) to allow null initialization
  getReturnType: () => 'Integer',

  // Get the serializer method name
  getSerializerMethod: () => 'serializeResult',

  // Preprocess test cases to extract expected from steps
  preprocessTestCases: (testCases) => {
    return testCases.map(tc => {
      // Extract expected value from last get() operation
      const expected = extractLRUExpected(tc);
      return {
        ...tc,
        expected: expected
      };
    });
  },

  // Transform user code to replace System.currentTimeMillis with TestClock
  transformUserCode: (userCode, testCases) => {
    const hasTimeControl = testCases.some(tc => 
      tc.steps && tc.steps.some(step => step.at !== undefined)
    );
    
    if (hasTimeControl) {
      return userCode.replace(
        /System\.currentTimeMillis\(\)/g,
        'TestClock.currentTimeMillis()'
      );
    }
    
    return userCode;
  }
};
