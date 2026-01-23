import { describe, test, expect } from '@jest/globals';
import { escapeJavaString } from '../../adapters/utils.js';

describe('escapeJavaString', () => {
  test('should escape backslashes', () => {
    expect(escapeJavaString('path\\to\\file')).toBe('path\\\\to\\\\file');
  });

  test('should escape double quotes', () => {
    expect(escapeJavaString('He said "hello"')).toBe('He said \\"hello\\"');
  });

  test('should escape newlines', () => {
    expect(escapeJavaString('line1\nline2')).toBe('line1\\nline2');
  });

  test('should escape carriage returns', () => {
    expect(escapeJavaString('line1\rline2')).toBe('line1\\rline2');
  });

  test('should escape tabs', () => {
    expect(escapeJavaString('col1\tcol2')).toBe('col1\\tcol2');
  });

  test('should handle multiple special characters', () => {
    const input = 'path\\to"file\nwith\ttabs';
    const expected = 'path\\\\to\\"file\\nwith\\ttabs';
    expect(escapeJavaString(input)).toBe(expected);
  });

  test('should handle undefined', () => {
    expect(escapeJavaString(undefined)).toBe('');
  });

  test('should handle null', () => {
    expect(escapeJavaString(null)).toBe('');
  });

  test('should handle empty string', () => {
    expect(escapeJavaString('')).toBe('');
  });

  test('should handle normal string without special characters', () => {
    expect(escapeJavaString('hello world')).toBe('hello world');
  });
});
