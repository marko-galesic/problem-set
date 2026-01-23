// Shared utility functions for adapters

export function escapeJavaString(str) {
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

