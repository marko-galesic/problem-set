import { createAdapter } from './baseAdapter.js';
import {
  buildExpectedIntMatrixCode,
  buildIntArrayInputHelper
} from './helpers/java.js';

export default createAdapter({
  extractInput: (testCase) => ({
    nums: testCase.nums !== undefined ? testCase.nums : []
  }),
  buildExpectedCode: (expected, indent = '        ', varName = 'expected') => {
    return buildExpectedIntMatrixCode(expected, indent, varName);
  },
  generateSerializer: () => {
    return `    // Serialize threeSum output with canonical ordering
    private static String serializeThreeSum(int[][] matrix) {
        if (matrix == null) return "null";
        if (matrix.length == 0) return "[]";

        int[][] normalized = new int[matrix.length][];
        for (int i = 0; i < matrix.length; i++) {
            int[] row = matrix[i];
            if (row == null) {
                normalized[i] = null;
                continue;
            }
            int[] copy = Arrays.copyOf(row, row.length);
            Arrays.sort(copy);
            normalized[i] = copy;
        }

        Arrays.sort(normalized, (a, b) -> {
            if (a == null && b == null) return 0;
            if (a == null) return -1;
            if (b == null) return 1;
            int len = Math.min(a.length, b.length);
            for (int i = 0; i < len; i++) {
                if (a[i] != b[i]) {
                    return Integer.compare(a[i], b[i]);
                }
            }
            return Integer.compare(a.length, b.length);
        });

        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < normalized.length; i++) {
            if (i > 0) sb.append(", ");
            int[] row = normalized[i];
            if (row == null) {
                sb.append("null");
                continue;
            }
            sb.append("[");
            for (int j = 0; j < row.length; j++) {
                if (j > 0) sb.append(", ");
                sb.append(row[j]);
            }
            sb.append("]");
        }
        sb.append("]");
        return sb.toString();
    }`;
  },
  generateInvocation: (parserVar) => {
    return `                    int[] nums = getTestNums(i);
                    actual = ${parserVar}.threeSum(nums);`;
  },
  generateInputHelpers: (testCases) => {
    return buildIntArrayInputHelper(testCases, 'nums', 'getTestNums');
  },
  getReturnType: () => 'int[][]',
  getSerializerMethod: () => 'serializeThreeSum',
  getDefaultClassName: () => 'ThreeSum'
});
