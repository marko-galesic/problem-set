import { createAdapter } from './baseAdapter.js';
import {
  buildExpectedStringMatrixCode,
  buildStringArrayInputHelper
} from './helpers/java.js';

export default createAdapter({
  extractInput: (testCase) => ({
    strs: testCase.strs !== undefined ? testCase.strs : []
  }),
  buildExpectedCode: (expected, indent = '        ', varName = 'expected') => {
    return buildExpectedStringMatrixCode(expected, indent, varName);
  },
  generateSerializer: () => {
    return `    // Serialize String[][] with canonical anagram grouping order
    private static String serializeGroupAnagrams(String[][] matrix) {
        if (matrix == null) return "null";
        if (matrix.length == 0) return "[]";

        List<String[]> normalized = new ArrayList<>();
        for (String[] row : matrix) {
            if (row == null) {
                normalized.add(null);
                continue;
            }
            String[] copy = Arrays.copyOf(row, row.length);
            Arrays.sort(copy, (a, b) -> {
                if (a == null && b == null) return 0;
                if (a == null) return -1;
                if (b == null) return 1;
                return a.compareTo(b);
            });
            normalized.add(copy);
        }

        normalized.sort((a, b) -> {
            if (a == null && b == null) return 0;
            if (a == null) return -1;
            if (b == null) return 1;
            int len = Math.min(a.length, b.length);
            for (int i = 0; i < len; i++) {
                String sa = a[i];
                String sb = b[i];
                if (sa == null && sb == null) continue;
                if (sa == null) return -1;
                if (sb == null) return 1;
                int cmp = sa.compareTo(sb);
                if (cmp != 0) return cmp;
            }
            return Integer.compare(a.length, b.length);
        });

        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < normalized.size(); i++) {
            if (i > 0) sb.append(", ");
            String[] row = normalized.get(i);
            if (row == null) {
                sb.append("null");
                continue;
            }
            sb.append("[");
            for (int j = 0; j < row.length; j++) {
                if (j > 0) sb.append(", ");
                String value = row[j];
                if (value == null) {
                    sb.append("null");
                } else {
                    sb.append("\\\"");
                    sb.append(value
                        .replace("\\\\", "\\\\\\\\")
                        .replace("\\n", "\\\\n")
                        .replace("\\r", "\\\\r")
                        .replace("\\t", "\\\\t")
                        .replace("\\\"", "\\\\\\\""));
                    sb.append("\\\"");
                }
            }
            sb.append("]");
        }
        sb.append("]");
        return sb.toString();
    }`;
  },
  generateInvocation: (parserVar) => {
    return `                    String[] strs = getTestStrs(i);
                    actual = ${parserVar}.groupAnagrams(strs);`;
  },
  generateInputHelpers: (testCases) => {
    return buildStringArrayInputHelper(testCases, 'strs', 'getTestStrs');
  },
  getReturnType: () => 'String[][]',
  getSerializerMethod: () => 'serializeGroupAnagrams',
  getDefaultClassName: () => 'GroupAnagrams'
});
