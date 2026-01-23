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
  extractInput: (testCase) => {
    return {
      capacity: testCase.capacity !== undefined ? testCase.capacity : 2,
      ttlMillis: testCase.ttlMillis !== undefined ? testCase.ttlMillis : null,
      steps: testCase.steps || []
    };
  },

  buildExpectedCode: (expected, indent = '    ', varName = 'expected') => {
    const value = expected === undefined || expected === null ? -1 : expected;
    return `${indent}${varName} = ${value}\n`;
  },

  generateSerializer: () => {
    return `def serialize_result(value):
    return "null" if value is None else str(value)
`;
  },

  generateInvocation: () => {
    return `TestClock.reset()
capacity = get_test_capacity(i)
ttl_millis = get_test_ttl(i)
steps = get_test_steps(i)

has_time_control = any(step.at is not None for step in steps)
base_time = TestClock.current_time_millis()
if has_time_control:
    TestClock.set_current_time(base_time)

cache = LRUCache(capacity, ttl_millis)
actual = -1

for step in steps:
    if step.at is not None:
        TestClock.set_current_time(base_time + step.at)
    if step.op == "put":
        cache.put(step.args[0], step.args[1])
    elif step.op == "get":
        actual = cache.get(step.args[0])`;
  },

  generateInputHelpers: (testCases) => {
    let stepsCode = '';
    testCases.forEach((testCase, idx) => {
      const steps = testCase.steps || [];
      if (steps.length === 0) {
        stepsCode += `        []`;
      } else {
        const stepLines = steps.map((step) => {
          const atValue = step.at !== undefined ? step.at : null;
          if (step.op === 'put') {
            return `Step("put", [${step.args[0]}, ${step.args[1]}], ${atValue === null ? 'None' : atValue})`;
          }
          if (step.op === 'get') {
            return `Step("get", [${step.args[0]}], ${atValue === null ? 'None' : atValue})`;
          }
          return null;
        }).filter(Boolean);
        stepsCode += `        [${stepLines.join(', ')}]`;
      }
      if (idx < testCases.length - 1) {
        stepsCode += ',\n';
      }
    });

    return `class Step:
    def __init__(self, op, args, at):
        self.op = op
        self.args = args
        self.at = at

def get_test_capacity(index):
    capacities = [
${testCases.map(tc => `        ${tc.capacity !== undefined ? tc.capacity : 2}`).join(',\n')}
    ]
    return capacities[index]

def get_test_ttl(index):
    ttls = [
${testCases.map(tc => `        ${tc.ttlMillis !== undefined ? tc.ttlMillis : '5 * 60 * 1000'}`).join(',\n')}
    ]
    return ttls[index]

def get_test_steps(index):
    all_steps = [
${stepsCode}
    ]
    return all_steps[index]
`;
  },

  checkUserDefinedClasses: (userCode) => {
    if (!userCode) return { hasLRUCache: false };
    const hasLRUCache = /\bclass\s+LRUCache\b/.test(userCode);
    return { hasLRUCache };
  },

  generateHelperClasses: () => '',
  getReturnType: () => 'int',
  getSerializerMethod: () => 'serialize_result',
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
    return userCode
      .replace(/time\.time_ns\(\)/g, 'TestClock.current_time_millis() * 1000000')
      .replace(/time\.time\(\)/g, 'TestClock.current_time_millis() / 1000.0');
  }
};
