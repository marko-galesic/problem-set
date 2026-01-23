/**
 * Mock Java executor for testing
 * Simulates compilation and execution without actually running Java
 */

/**
 * Creates a mock executor that simulates successful execution
 */
export function createMockExecutor(successOutput, stderr = '') {
  return {
    async executeJavaCode(userCode, testCases, adapter, challengeId) {
      return {
        success: true,
        results: testCases.map((tc, idx) => ({
          testCase: tc,
          actual: `actual_${idx}`,
          expected: `expected_${idx}`,
          passed: true,
          executionTime: 10 + idx,
          stdout: ''
        })),
        totalTime: 100
      };
    }
  };
}

/**
 * Creates a mock executor that simulates compilation failure
 */
export function createMockExecutorWithCompilationError(errorMessage) {
  return {
    async executeJavaCode(userCode, testCases, adapter, challengeId) {
      return {
        success: false,
        error: `Compilation error: ${errorMessage}`,
        results: []
      };
    }
  };
}

/**
 * Creates a mock executor that simulates runtime error
 */
export function createMockExecutorWithRuntimeError(errorMessage) {
  return {
    async executeJavaCode(userCode, testCases, adapter, challengeId) {
      return {
        success: false,
        error: `Runtime error: ${errorMessage}`,
        results: []
      };
    }
  };
}

/**
 * Creates a mock executor that simulates timeout
 */
export function createMockExecutorWithTimeout() {
  return {
    async executeJavaCode(userCode, testCases, adapter, challengeId) {
      return {
        success: false,
        error: 'Execution timeout',
        results: []
      };
    }
  };
}

/**
 * Creates a mock executor with custom output parsing
 */
export function createMockExecutorWithOutput(output) {
  return {
    async executeJavaCode(userCode, testCases, adapter, challengeId) {
      // Parse the output to extract results
      const results = [];
      for (let i = 0; i < testCases.length; i++) {
        const actualMatch = output.match(new RegExp(`TEST_${i}_ACTUAL:(.+)`));
        const expectedMatch = output.match(new RegExp(`TEST_${i}_EXPECTED:(.+)`));
        const resultMatch = output.match(new RegExp(`TEST_${i}_RESULT:(.+)`));
        const timeMatch = output.match(new RegExp(`TEST_${i}_TIME:(.+)`));
        
        results.push({
          testCase: testCases[i],
          actual: actualMatch ? actualMatch[1].trim() : null,
          expected: expectedMatch ? expectedMatch[1].trim() : null,
          passed: resultMatch ? resultMatch[1].trim() === 'PASS' : false,
          executionTime: timeMatch ? parseInt(timeMatch[1].trim()) || 0 : 0,
          stdout: ''
        });
      }
      
      return {
        success: true,
        results,
        totalTime: results.reduce((sum, r) => sum + r.executionTime, 0)
      };
    }
  };
}
