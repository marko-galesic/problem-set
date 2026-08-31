function intVectorLiteral(values) {
  const items = Array.isArray(values) ? values : [];
  return `{ ${items.map((value) => Number(value) || 0).join(', ')} }`;
}

export function buildExpectedIntCode(expected, indent = '  ', varName = 'expected') {
  const value = Number.isFinite(expected) ? expected : 0;
  return `${indent}int ${varName} = ${value};\n`;
}

export function serializeInt() {
  return `static std::string serializeInt(int value) {
  return std::to_string(value);
}`;
}

export function buildIntScalarInputHelper(testCases, fieldName, methodName) {
  const values = testCases.map((testCase) => (
    Number.isFinite(testCase[fieldName]) ? testCase[fieldName] : 0
  ));
  return `static int ${methodName}(int index) {
  static const std::vector<int> inputs = ${intVectorLiteral(values)};
  return inputs.at(index);
}`;
}

export function buildIntArrayInputHelper(testCases, fieldName, methodName) {
  const cases = testCases.map((testCase) => intVectorLiteral(testCase[fieldName])).join(',\n    ');
  return `static std::vector<int> ${methodName}(int index) {
  static const std::vector<std::vector<int>> inputs = {
    ${cases}
  };
  return inputs.at(index);
}`;
}

export function buildIntGridInputHelper(testCases, fieldName, methodName) {
  const cases = testCases.map((testCase) => {
    const grid = Array.isArray(testCase[fieldName]) ? testCase[fieldName] : [];
    const rows = grid.map((row) => intVectorLiteral(row)).join(', ');
    return `{ ${rows} }`;
  }).join(',\n    ');
  return `static std::vector<std::vector<int>> ${methodName}(int index) {
  static const std::vector<std::vector<std::vector<int>>> inputs = {
    ${cases}
  };
  return inputs.at(index);
}`;
}
