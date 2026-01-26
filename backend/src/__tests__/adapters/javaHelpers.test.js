import { describe, test, expect } from '@jest/globals';
import {
  buildExpectedStringCode,
  buildExpectedIntArrayCode,
  buildExpectedDoubleCode,
  buildStringInputHelper,
  buildIntArrayInputHelper,
  buildIntScalarInputHelper,
  buildCharGridInputHelper,
  buildIntGridInputHelper,
  buildExpectedIntMatrixCode,
  buildExpectedStringArrayCode,
  buildExpectedStringArrayCoerceEmptyCode,
  buildExpectedStringMatrixCode,
  buildExpectedCharMatrixCode,
  buildStringArrayInputHelper
} from '../../adapters/helpers/java.js';

describe('Java adapter helper builders', () => {
  test('buildExpectedStringCode handles null and value inputs', () => {
    expect(buildExpectedStringCode(null)).toContain('String expected = ""');
    expect(buildExpectedStringCode('hi')).toContain('String expected = "hi"');
  });

  test('buildExpectedIntArrayCode and buildExpectedDoubleCode handle invalid inputs', () => {
    expect(buildExpectedIntArrayCode(null)).toContain('int[] expected = null');
    expect(buildExpectedIntArrayCode([1, 2])).toContain('new int[] { 1, 2 }');
    expect(buildExpectedDoubleCode(NaN)).toContain('double expected = 0.0');
    expect(buildExpectedDoubleCode(1.5)).toContain('double expected = 1.5');
  });

  test('buildStringInputHelper uses fallback when field is missing', () => {
    const helper = buildStringInputHelper([{ value: 'a' }, {}], 'value', 'getValue');
    expect(helper).toContain('"a"');
    expect(helper).toContain('""');
  });

  test('buildIntArrayInputHelper and buildIntScalarInputHelper use defaults', () => {
    const arrayHelper = buildIntArrayInputHelper([{ nums: [1, 2] }, {}], 'nums', 'getNums');
    expect(arrayHelper).toContain('new int[] { 1, 2 }');
    expect(arrayHelper).toContain('new int[] {  }');

    const scalarHelper = buildIntScalarInputHelper([{ val: 3 }, {}], 'val', 'getVal');
    expect(scalarHelper).toContain('3');
    expect(scalarHelper).toContain('0');
  });

  test('buildCharGridInputHelper handles empty and non-array rows', () => {
    const helper = buildCharGridInputHelper(
      [{ grid: [] }, { grid: ['x'] }, { grid: [['a', 1]] }],
      'grid',
      'getGrid'
    );
    expect(helper).toContain('new char[0][0]');
    expect(helper).toContain('new char[0]');
    expect(helper).toContain("new char[] { 'a', '1' }");
  });

  test('buildIntGridInputHelper handles empty and non-array rows', () => {
    const helper = buildIntGridInputHelper(
      [{ grid: [] }, { grid: ['x'] }, { grid: [[1, 2]] }],
      'grid',
      'getGrid'
    );
    expect(helper).toContain('new int[0][0]');
    expect(helper).toContain('new int[0]');
    expect(helper).toContain('new int[] { 1, 2 }');
  });

  test('buildExpectedIntMatrixCode handles invalid and empty inputs', () => {
    expect(buildExpectedIntMatrixCode(null)).toContain('int[][] expected = null');
    expect(buildExpectedIntMatrixCode([])).toContain('new int[0][0]');
    expect(buildExpectedIntMatrixCode([[1], 'x'])).toContain('null');
  });

  test('buildExpectedStringArrayCode handles invalid and null values', () => {
    expect(buildExpectedStringArrayCode(null)).toContain('String[] expected = null');
    expect(buildExpectedStringArrayCode(['a', null])).toContain('null');
  });

  test('buildExpectedStringArrayCoerceEmptyCode coerces null to empty', () => {
    expect(buildExpectedStringArrayCoerceEmptyCode(null)).toContain('String[] expected = null');
    expect(buildExpectedStringArrayCoerceEmptyCode(['a', null])).toContain('""');
  });

  test('buildExpectedStringMatrixCode handles invalid, empty, and null rows', () => {
    expect(buildExpectedStringMatrixCode(null)).toContain('String[][] expected = null');
    expect(buildExpectedStringMatrixCode([])).toContain('new String[0][0]');
    const matrix = buildExpectedStringMatrixCode([['a', null], 'x']);
    expect(matrix).toContain('new String[0]');
    expect(matrix).toContain('null');
  });

  test('buildExpectedCharMatrixCode handles invalid and empty inputs', () => {
    expect(buildExpectedCharMatrixCode(null)).toContain('char[][] expected = null');
    expect(buildExpectedCharMatrixCode([])).toContain('new char[0][0]');
    expect(buildExpectedCharMatrixCode([['a'], 'x'])).toContain('null');
  });

  test('buildStringArrayInputHelper handles non-arrays and null entries', () => {
    const helper = buildStringArrayInputHelper([{ words: ['a', null] }, { words: 'nope' }], 'words', 'getWords');
    expect(helper).toContain('new String[] { "a", null }');
    expect(helper).toContain('new String[] {  }');
  });
});
