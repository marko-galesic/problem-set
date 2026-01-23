import { pythonLiteral, escapePythonString } from '../python/utils.js';

export function buildExpectedIntCode(expected, indent = '    ', varName = 'expected') {
  const value = expected === null || expected === undefined ? 0 : expected;
  return `${indent}${varName} = ${value}\n`;
}

export function buildExpectedDoubleCode(expected, indent = '    ', varName = 'expected') {
  const value = expected === null || expected === undefined ? 0.0 : expected;
  return `${indent}${varName} = ${value}\n`;
}

export function buildExpectedBooleanCode(expected, indent = '    ', varName = 'expected') {
  const value = expected ? 'True' : 'False';
  return `${indent}${varName} = ${value}\n`;
}

export function buildExpectedStringCode(expected, indent = '    ', varName = 'expected') {
  const value = expected === null || expected === undefined ? '' : String(expected);
  return `${indent}${varName} = ${pythonLiteral(value)}\n`;
}

export function buildExpectedListCode(expected, indent = '    ', varName = 'expected') {
  return `${indent}${varName} = ${pythonLiteral(expected)}\n`;
}

export function buildExpectedStringArrayCoerceEmptyCode(expected, indent = '    ', varName = 'expected') {
  if (!Array.isArray(expected)) {
    return `${indent}${varName} = None\n`;
  }
  const normalized = expected.map((value) => value === null || value === undefined ? '' : String(value));
  return `${indent}${varName} = ${pythonLiteral(normalized)}\n`;
}

export function serializeInt() {
  return `def serialize_int(value):
    return "null" if value is None else str(value)
`;
}

export function serializeDouble() {
  return `def serialize_double(value):
    if value is None:
        return "null"
    return f"{value:.5f}"
`;
}

export function serializeBoolean() {
  return `def serialize_boolean(value):
    if value is None:
        return "null"
    return "true" if value else "false"
`;
}

export function serializeString() {
  return `def serialize_string(value):
    if value is None:
        return "null"
    return value.replace("\\\\", "\\\\\\\\").replace("\\n", "\\\\n").replace("\\r", "\\\\r").replace("\\t", "\\\\t")
`;
}

export function serializeIntArray() {
  return `def serialize_int_array(arr):
    if arr is None:
        return "null"
    return "[" + ", ".join(str(x) for x in arr) + "]"
`;
}

export function serializeStringArray() {
  return `def serialize_string_array(arr):
    if arr is None:
        return "null"
    import json
    items = []
    for value in arr:
        if value is None:
            items.append("null")
        else:
            items.append(json.dumps(str(value)))
    return "[" + ", ".join(items) + "]"
`;
}

export function serializeStringArrayCoerceEmpty() {
  return String.raw`def serialize_string_array(arr):
    if arr is None:
        return "null"
    parts = []
    for value in arr:
        if value is None:
            value = ""
        else:
            value = str(value)
        escaped = value.replace("\\", "\\\\").replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t").replace("\"", "\\\"")
        parts.append(f"\"{escaped}\"")
    return "[" + ", ".join(parts) + "]"
`;
}

export function serializeIntMatrix() {
  return `def serialize_int_matrix(matrix):
    if matrix is None:
        return "null"
    if not isinstance(matrix, list):
        return "null"
    if len(matrix) == 0:
        return "[]"

    parts = []
    for row in matrix:
        if row is None:
            parts.append("null")
        else:
            parts.append("[" + ", ".join(str(x) for x in row) + "]")

    return "[" + ", ".join(parts) + "]"
`;
}

export function serializeStringMatrix() {
  return `def serialize_string_matrix(matrix):
    if matrix is None:
        return "null"
    if not isinstance(matrix, list):
        return "null"
    if len(matrix) == 0:
        return "[]"

    import json
    rows = []
    for row in matrix:
        if row is None:
            rows.append("null")
            continue
        items = []
        for value in row:
            if value is None:
                items.append("null")
            else:
                items.append(json.dumps(str(value)))
        rows.append("[" + ", ".join(items) + "]")
    return "[" + ", ".join(rows) + "]"
`;
}

export function serializeCharMatrix() {
  return `def serialize_char_matrix(matrix):
    if matrix is None:
        return "null"
    if not isinstance(matrix, list):
        return "null"
    if len(matrix) == 0:
        return "[]"

    parts = []
    for row in matrix:
        if row is None:
            parts.append("null")
            continue
        cells = []
        for cell in row:
            value = '' if cell is None else str(cell)
            escaped = (value
                .replace('\\\\', '\\\\\\\\')
                .replace(\"'\", \"\\\\'\")
                .replace(\"\\n\", \"\\\\n\")
                .replace(\"\\r\", \"\\\\r\")
                .replace(\"\\t\", \"\\\\t\"))
            cells.append(\"'\" + escaped + \"'\")
        parts.append(\"[\" + \", \".join(cells) + \"]\")

    return \"[\" + \", \".join(parts) + \"]\"
`;
}

export function buildListInputHelper(testCases, fieldName, methodName) {
  return `def ${methodName}(index):
    inputs = [
${testCases.map((tc) => `        ${pythonLiteral(tc[fieldName] !== undefined ? tc[fieldName] : [])}`).join(',\n')}
    ]
    return inputs[index]
`;
}

export function buildStringArrayInputHelper(testCases, fieldName, methodName) {
  return buildListInputHelper(testCases, fieldName, methodName);
}

export function buildIntScalarInputHelper(testCases, fieldName, methodName) {
  return `def ${methodName}(index):
    inputs = [
${testCases.map((tc) => `        ${tc[fieldName] !== undefined ? tc[fieldName] : 0}`).join(',\n')}
    ]
    return inputs[index]
`;
}

export function buildStringInputHelper(testCases, fieldName, methodName) {
  return `def ${methodName}(index):
    inputs = [
${testCases.map((tc) => `        "${escapePythonString(tc[fieldName] !== undefined ? String(tc[fieldName]) : '')}"`).join(',\n')}
    ]
    return inputs[index]
`;
}

export function buildGridInputHelper(testCases, fieldName, methodName) {
  return `def ${methodName}(index):
    grids = [
${testCases.map((tc) => `        ${pythonLiteral(tc[fieldName] !== undefined ? tc[fieldName] : [])}`).join(',\n')}
    ]
    grid = grids[index]
    return [row[:] for row in grid]
`;
}
