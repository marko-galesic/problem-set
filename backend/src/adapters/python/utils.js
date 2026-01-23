// Shared utility functions for Python adapters

export function escapePythonString(str) {
  if (str === undefined || str === null) {
    return '';
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

export function pythonLiteral(value) {
  if (value === null || value === undefined) {
    return 'None';
  }
  if (Array.isArray(value)) {
    return `[${value.map(pythonLiteral).join(', ')}]`;
  }
  if (typeof value === 'string') {
    return `"${escapePythonString(value)}"`;
  }
  if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  }
  if (Number.isFinite(value)) {
    return String(value);
  }
  return 'None';
}
