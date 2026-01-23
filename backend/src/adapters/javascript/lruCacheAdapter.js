function extractLRUExpected(testCase) {
  if (!testCase.steps || !Array.isArray(testCase.steps)) {
    return -1;
  }
  for (let i = testCase.steps.length - 1; i >= 0; i--) {
    const step = testCase.steps[i];
    if (step.op === 'get' && step.expected !== undefined) {
      return step.expected;
    }
  }
  return -1;
}

export default {
  extractInput: (testCase) => ({
    capacity: testCase.capacity !== undefined ? testCase.capacity : 2,
    ttlMillis: testCase.ttlMillis !== undefined ? testCase.ttlMillis : null,
    steps: testCase.steps || []
  }),
  buildExpectedCode: (expected, indent = '  ', varName = 'expected') => {
    const value = expected === undefined || expected === null ? -1 : expected;
    return `${indent}const ${varName} = ${value};\n`;
  },
  generateSerializer: () => {
    return `function serializeResult(value) {
  return value === null || value === undefined ? "null" : String(value);
}`;
  },
  generateInvocation: () => {
    return `TestClock.reset();
          const capacity = getTestCapacity(i);
          const ttlMillis = getTestTTL(i);
          const steps = getTestSteps(i);
          const hasTimeControl = steps.some(step => step.at !== null && step.at !== undefined);
          const baseTime = TestClock.currentTimeMillis();
          if (hasTimeControl) {
            TestClock.setCurrentTime(baseTime);
          }
          const cache = new LRUCache(capacity, ttlMillis);
          actual = -1;
          for (const step of steps) {
            if (step.at !== null && step.at !== undefined) {
              TestClock.setCurrentTime(baseTime + step.at);
            }
            if (step.op === "put") {
              cache.put(step.args[0], step.args[1]);
            } else if (step.op === "get") {
              actual = cache.get(step.args[0]);
            }
          }`;
  },
  generateInputHelpers: (testCases) => {
    let stepsCode = '';
    testCases.forEach((testCase, idx) => {
      const steps = testCase.steps || [];
      if (steps.length === 0) {
        stepsCode += `    []`;
      } else {
        const stepLines = steps.map((step) => {
          const atValue = step.at !== undefined ? step.at : null;
          if (step.op === 'put') {
            return `    new Step("put", [${step.args[0]}, ${step.args[1]}], ${atValue === null ? 'null' : atValue})`;
          }
          if (step.op === 'get') {
            return `    new Step("get", [${step.args[0]}], ${atValue === null ? 'null' : atValue})`;
          }
          return null;
        }).filter(Boolean);
        stepsCode += `    [\n${stepLines.join(',\n')}\n    ]`;
      }
      if (idx < testCases.length - 1) {
        stepsCode += ',\n';
      }
    });

    return `class Step {
  constructor(op, args, at) {
    this.op = op;
    this.args = args;
    this.at = at;
  }
}

function getTestCapacity(index) {
  const capacities = [
${testCases.map(tc => `    ${tc.capacity !== undefined ? tc.capacity : 2}`).join(',\n')}
  ];
  return capacities[index];
}

function getTestTTL(index) {
  const ttls = [
${testCases.map(tc => `    ${tc.ttlMillis !== undefined ? tc.ttlMillis : '5 * 60 * 1000'}`).join(',\n')}
  ];
  return ttls[index];
}

function getTestSteps(index) {
  const allSteps = [
${stepsCode}
  ];
  return allSteps[index];
}`;
  },
  checkUserDefinedClasses: (userCode) => {
    if (!userCode) return { hasLRUCache: false };
    const hasLRUCache = /\bclass\s+LRUCache\b/.test(userCode);
    return { hasLRUCache };
  },
  generateHelperClasses: () => '',
  getReturnType: () => 'number',
  getSerializerMethod: () => 'serializeResult',
  getDefaultClassName: () => 'LRUCache',
  preprocessTestCases: (testCases) => {
    return testCases.map(tc => ({
      ...tc,
      expected: extractLRUExpected(tc)
    }));
  },
  transformUserCode: (userCode, testCases) => {
    const hasTimeControl = testCases.some(tc =>
      tc.steps && tc.steps.some(step => step.at !== undefined)
    );
    if (!hasTimeControl) {
      return userCode;
    }
    return userCode.replace(/Date\.now\(\)/g, 'TestClock.currentTimeMillis()');
  }
};
