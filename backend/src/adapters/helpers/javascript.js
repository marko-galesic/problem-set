function escapeJsString(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

export function buildExpectedIntCode(expected, indent = '  ', varName = 'expected') {
  const value = Number.isFinite(expected) ? expected : 0;
  return `${indent}const ${varName} = ${value};\n`;
}

export function buildExpectedDoubleCode(expected, indent = '  ', varName = 'expected') {
  const value = Number.isFinite(expected) ? expected : 0;
  return `${indent}const ${varName} = ${value};\n`;
}

export function buildExpectedBooleanCode(expected, indent = '  ', varName = 'expected') {
  const value = expected ? 'true' : 'false';
  return `${indent}const ${varName} = ${value};\n`;
}

export function buildExpectedStringCode(expected, indent = '  ', varName = 'expected') {
  const value = expected === null || expected === undefined ? '' : escapeJsString(expected);
  return `${indent}const ${varName} = "${value}";\n`;
}

export function buildExpectedListCode(expected, indent = '  ', varName = 'expected') {
  const literal = JSON.stringify(expected ?? null);
  return `${indent}const ${varName} = ${literal};\n`;
}

export function buildExpectedStringArrayCoerceEmptyCode(expected, indent = '  ', varName = 'expected') {
  if (!Array.isArray(expected)) {
    return `${indent}const ${varName} = null;\n`;
  }
  const normalized = expected.map((value) => value === null || value === undefined ? '' : String(value));
  return `${indent}const ${varName} = ${JSON.stringify(normalized)};\n`;
}

export function serializeInt() {
  return `function serializeInt(value) {
  return value === null || value === undefined ? "null" : String(value);
}`;
}

export function serializeDouble() {
  return `function serializeDouble(value) {
  if (value === null || value === undefined) return "null";
  if (!Number.isFinite(value)) return String(value);
  const rounded = Math.round(value * 100000) / 100000;
  return rounded.toFixed(5);
}`;
}

export function serializeBoolean() {
  return `function serializeBoolean(value) {
  if (value === null || value === undefined) return "null";
  return value ? "true" : "false";
}`;
}

export function serializeString() {
  return `function serializeString(value) {
  if (value === null || value === undefined) return "null";
  return String(value)
    .replace(/\\\\/g, "\\\\\\\\")
    .replace(/\\n/g, "\\\\n")
    .replace(/\\r/g, "\\\\r")
    .replace(/\\t/g, "\\\\t");
}`;
}

export function serializeIntArray() {
  return `function serializeIntArray(arr) {
  if (arr === null || arr === undefined) return "null";
  if (arr.length === 0) return "[]";
  return "[" + arr.join(", ") + "]";
}`;
}

export function serializeStringArray() {
  return `function serializeStringArray(arr) {
  if (arr === null || arr === undefined) return "null";
  const items = arr.map((value) => {
    if (value === null || value === undefined) return "null";
    return JSON.stringify(String(value));
  });
  return "[" + items.join(", ") + "]";
}`;
}

export function serializeStringArrayCoerceEmpty() {
  return String.raw`function serializeStringArray(arr) {
  if (arr === null || arr === undefined) return "null";
  if (!Array.isArray(arr)) return "null";
  const escaped = arr.map((value) => {
    const str = value === null || value === undefined ? "" : String(value);
    return "\"" + str
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/"/g, "\\\"") + "\"";
  });
  return "[" + escaped.join(", ") + "]";
}`;
}

export function serializeIntMatrix() {
  return `function serializeIntMatrix(matrix) {
  if (matrix === null || matrix === undefined) return "null";
  if (!Array.isArray(matrix)) return "null";
  if (matrix.length === 0) return "[]";
  const parts = matrix.map((row) => {
    if (row === null || row === undefined) return "null";
    return "[" + row.join(", ") + "]";
  });
  return "[" + parts.join(", ") + "]";
}`;
}

export function serializeStringMatrix() {
  return `function serializeStringMatrix(matrix) {
  if (matrix === null || matrix === undefined) return "null";
  if (!Array.isArray(matrix)) return "null";
  if (matrix.length === 0) return "[]";
  const rows = matrix.map((row) => {
    if (!Array.isArray(row)) return "null";
    const items = row.map((value) => {
      if (value === null || value === undefined) return "null";
      return JSON.stringify(String(value));
    });
    return "[" + items.join(", ") + "]";
  });
  return "[" + rows.join(", ") + "]";
}`;
}

export function serializeCharMatrix() {
  return `function serializeCharMatrix(matrix) {
  if (matrix === null || matrix === undefined) return "null";
  if (!Array.isArray(matrix)) return "null";
  if (matrix.length === 0) return "[]";
  const rows = matrix.map((row) => {
    if (!Array.isArray(row)) return "null";
    const cells = row.map((cell) => "'" + escapeChar(cell ?? '') + "'");
    return "[" + cells.join(", ") + "]";
  });
  return "[" + rows.join(", ") + "]";
}

function escapeChar(value) {
  return String(value)
    .replace(/\\\\/g, "\\\\\\\\")
    .replace(/'/g, "\\\\'")
    .replace(/\\n/g, "\\\\n")
    .replace(/\\r/g, "\\\\r")
    .replace(/\\t/g, "\\\\t");
}`;
}

export function serializeListNode() {
  return `function serializeListNode(head) {
  if (!head) return "null";
  const values = [];
  let current = head;
  while (current) {
    values.push(current.val);
    current = current.next;
  }
  return "[" + values.join(", ") + "]";
}`;
}

export function serializeTreeNode() {
  return `function serializeTreeNode(root) {
  if (!root) return "null";
  const result = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (!node) {
      result.push("null");
      continue;
    }
    result.push(String(node.val));
    queue.push(node.left || null);
    queue.push(node.right || null);
  }
  while (result.length && result[result.length - 1] === "null") {
    result.pop();
  }
  return "[" + result.join(", ") + "]";
}`;
}

export function buildIntArrayInputHelper(testCases, fieldName, methodName) {
  const inputs = testCases.map(tc => tc[fieldName] !== undefined ? tc[fieldName] : []);
  return `function ${methodName}(index) {
  const inputs = ${JSON.stringify(inputs)};
  return inputs[index];
}`;
}

export function buildIntScalarInputHelper(testCases, fieldName, methodName) {
  const inputs = testCases.map(tc => tc[fieldName] !== undefined ? tc[fieldName] : 0);
  return `function ${methodName}(index) {
  const inputs = ${JSON.stringify(inputs)};
  return inputs[index];
}`;
}

export function buildStringInputHelper(testCases, fieldName, methodName) {
  const inputs = testCases.map(tc => escapeJsString(tc[fieldName] !== undefined ? String(tc[fieldName]) : ''));
  return `function ${methodName}(index) {
  const inputs = [
${inputs.map(value => `    "${value}"`).join(',\n')}
  ];
  return inputs[index];
}`;
}

export function buildStringArrayInputHelper(testCases, fieldName, methodName) {
  const inputs = testCases.map((tc) => {
    const values = Array.isArray(tc[fieldName]) ? tc[fieldName] : [];
    return values.map((value) => value === null || value === undefined ? null : String(value));
  });
  return `function ${methodName}(index) {
  const inputs = ${JSON.stringify(inputs)};
  return inputs[index];
}`;
}

export function buildGridInputHelper(testCases, fieldName, methodName) {
  const grids = testCases.map(tc => tc[fieldName] !== undefined ? tc[fieldName] : []);
  return `function ${methodName}(index) {
  const grids = ${JSON.stringify(grids)};
  const grid = grids[index] || [];
  return grid.map(row => row.slice());
}`;
}

export function buildCharGridInputHelper(testCases, fieldName, methodName) {
  const grids = testCases.map(tc => tc[fieldName] !== undefined ? tc[fieldName] : []);
  return `function ${methodName}(index) {
  const grids = ${JSON.stringify(grids)};
  const grid = grids[index] || [];
  return grid.map(row => row.slice());
}`;
}
