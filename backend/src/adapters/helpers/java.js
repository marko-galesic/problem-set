import { escapeJavaString } from '../utils.js';

function escapeJavaStringBasic(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function resolveEscape(value, escapeMode) {
  if (escapeMode === 'basic') {
    return escapeJavaStringBasic(value);
  }
  return escapeJavaString(value);
}

export function buildExpectedIntCode(expected, indent = '        ', varName = 'expected') {
  if (expected === null || expected === undefined) {
    return `${indent}int ${varName} = 0;\n`;
  }
  return `${indent}int ${varName} = ${expected};\n`;
}

export function buildExpectedBooleanCode(expected, indent = '        ', varName = 'expected') {
  if (expected === null || expected === undefined) {
    return `${indent}boolean ${varName} = false;\n`;
  }
  return `${indent}boolean ${varName} = ${expected};\n`;
}

export function buildExpectedStringCode(expected, indent = '        ', varName = 'expected') {
  if (expected === null || expected === undefined) {
    return `${indent}String ${varName} = "";\n`;
  }
  const escaped = escapeJavaString(String(expected));
  return `${indent}String ${varName} = "${escaped}";\n`;
}

export function buildExpectedIntArrayCode(expected, indent = '        ', varName = 'expected') {
  if (!expected || !Array.isArray(expected)) {
    return `${indent}int[] ${varName} = null;\n`;
  }
  const elements = expected.map((val) => `${val}`).join(', ');
  return `${indent}int[] ${varName} = new int[] { ${elements} };\n`;
}

export function buildExpectedDoubleCode(expected, indent = '        ', varName = 'expected') {
  if (expected === null || expected === undefined || !Number.isFinite(expected)) {
    return `${indent}double ${varName} = 0.0;\n`;
  }
  return `${indent}double ${varName} = ${expected};\n`;
}

export function serializeInt() {
  return `    // Serialize an int to a canonical string representation
    private static String serializeInt(int value) {
        return String.valueOf(value);
    }`;
}

export function serializeDouble() {
  return `    // Serialize a double to a canonical string representation
    private static String serializeDouble(double value) {
        if (Double.isNaN(value) || Double.isInfinite(value)) {
            return String.valueOf(value);
        }
        double rounded = Math.round(value * 100000.0) / 100000.0;
        return String.format(java.util.Locale.US, "%.5f", rounded);
    }`;
}

export function serializeBoolean() {
  return `    // Serialize a boolean to a canonical string representation
    private static String serializeBoolean(boolean value) {
        return String.valueOf(value);
    }`;
}

export function serializeString() {
  return [
    '    // Serialize a String to a canonical representation',
    '    private static String serializeString(String value) {',
    '        if (value == null) return "null";',
    '        return value',
    '            .replace("\\\\", "\\\\\\\\")',
    '            .replace("\\n", "\\\\n")',
    '            .replace("\\r", "\\\\r")',
    '            .replace("\\t", "\\\\t");',
    '    }'
  ].join('\n');
}

export function serializeIntArray() {
  return `    // Serialize an int[] to a canonical string representation
    private static String serializeIntArray(int[] arr) {
        if (arr == null) return "null";
        if (arr.length == 0) return "[]";
        
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(", ");
            sb.append(arr[i]);
        }
        sb.append("]");
        return sb.toString();
    }`;
}

export function buildStringInputHelper(testCases, fieldName, methodName, escapeMode = 'basic') {
  return `    private static String ${methodName}(int index) {
        String[] inputs = {
${testCases.map((tc) => {
    const value = tc[fieldName] !== undefined ? tc[fieldName] : "";
    const escaped = resolveEscape(String(value), escapeMode);
    return `            "${escaped}"`;
  }).join(',\n')}
        };
        return inputs[index];
    }`;
}

export function buildIntArrayInputHelper(testCases, fieldName, methodName) {
  return `    private static int[] ${methodName}(int index) {
        int[][] inputs = {
${testCases.map((tc) => {
    const values = tc[fieldName] !== undefined ? tc[fieldName] : [];
    const list = values.map((val) => `${val}`).join(', ');
    return `            new int[] { ${list} }`;
  }).join(',\n')}
        };
        return inputs[index];
    }`;
}

export function buildIntScalarInputHelper(testCases, fieldName, methodName, arrayName = 'inputs') {
  return `    private static int ${methodName}(int index) {
        int[] ${arrayName} = {
${testCases.map((tc) => {
    const value = tc[fieldName] !== undefined ? tc[fieldName] : 0;
    return `            ${value}`;
  }).join(',\n')}
        };
        return ${arrayName}[index];
    }`;
}

export function buildCharGridInputHelper(testCases, fieldName, methodName) {
  return `    private static char[][] ${methodName}(int index) {
        char[][][] grids = {
${testCases.map((tc) => {
    const grid = tc[fieldName] !== undefined ? tc[fieldName] : [];
    if (!Array.isArray(grid) || grid.length === 0) {
      return `            new char[0][0]`;
    }
    const rows = grid.map((row) => {
      if (!Array.isArray(row)) {
        return 'new char[0]';
      }
      const chars = row.map((c) => {
        const char = typeof c === 'string' ? c : String(c);
        return `'${char}'`;
      }).join(', ');
      return `new char[] { ${chars} }`;
    });
    return `            new char[][] { ${rows.join(', ')} }`;
  }).join(',\n')}
        };
        return grids[index];
    }`;
}

export function buildIntGridInputHelper(testCases, fieldName, methodName) {
  return `    private static int[][] ${methodName}(int index) {
        int[][][] grids = {
${testCases.map((tc) => {
    const grid = tc[fieldName] !== undefined ? tc[fieldName] : [];
    if (!Array.isArray(grid) || grid.length === 0) {
      return `            new int[0][0]`;
    }
    const rows = grid.map((row) => {
      if (!Array.isArray(row)) {
        return 'new int[0]';
      }
      const nums = row.map((n) => `${n}`).join(', ');
      return `new int[] { ${nums} }`;
    });
    return `            new int[][] { ${rows.join(', ')} }`;
  }).join(',\n')}
        };
        return grids[index];
    }`;
}

export function buildExpectedIntMatrixCode(expected, indent = '        ', varName = 'expected') {
  if (!Array.isArray(expected)) {
    return `${indent}int[][] ${varName} = null;\n`;
  }
  if (expected.length === 0) {
    return `${indent}int[][] ${varName} = new int[0][0];\n`;
  }
  const rows = expected.map((row) => {
    if (!Array.isArray(row)) {
      return 'null';
    }
    const values = row.map((val) => `${val}`).join(', ');
    return `new int[] { ${values} }`;
  }).join(', ');
  return `${indent}int[][] ${varName} = new int[][] { ${rows} };\n`;
}

export function buildExpectedStringArrayCode(expected, indent = '        ', varName = 'expected') {
  if (!Array.isArray(expected)) {
    return `${indent}String[] ${varName} = null;\n`;
  }

  const elements = expected.map((value) => {
    if (value === null || value === undefined) {
      return 'null';
    }
    return `"${escapeJavaString(String(value))}"`;
  }).join(', ');

  return `${indent}String[] ${varName} = new String[] { ${elements} };\n`;
}

export function buildExpectedStringArrayCoerceEmptyCode(expected, indent = '        ', varName = 'expected') {
  if (!Array.isArray(expected)) {
    return `${indent}String[] ${varName} = null;\n`;
  }
  const elements = expected.map((value) => {
    const safe = value === null || value === undefined ? '' : String(value);
    return `"${escapeJavaString(safe)}"`;
  }).join(', ');
  return `${indent}String[] ${varName} = new String[] { ${elements} };\n`;
}

export function buildExpectedStringMatrixCode(expected, indent = '        ', varName = 'expected') {
  if (!Array.isArray(expected)) {
    return `${indent}String[][] ${varName} = null;\n`;
  }
  if (expected.length === 0) {
    return `${indent}String[][] ${varName} = new String[0][0];\n`;
  }
  const rows = expected.map((row) => {
    if (!Array.isArray(row)) {
      return 'new String[0]';
    }
    const values = row.map((value) => {
      if (value === null || value === undefined) {
        return 'null';
      }
      return `"${escapeJavaString(String(value))}"`;
    }).join(', ');
    return `new String[] { ${values} }`;
  });
  return `${indent}String[][] ${varName} = new String[][] { ${rows.join(', ')} };\n`;
}

function escapeCharLiteral(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

export function buildExpectedCharMatrixCode(expected, indent = '        ', varName = 'expected') {
  if (!Array.isArray(expected)) {
    return `${indent}char[][] ${varName} = null;\n`;
  }
  if (expected.length === 0) {
    return `${indent}char[][] ${varName} = new char[0][0];\n`;
  }
  const rows = expected.map((row) => {
    if (!Array.isArray(row)) {
      return 'null';
    }
    const chars = row.map((value) => {
      const char = escapeCharLiteral(value);
      return `'${char}'`;
    }).join(', ');
    return `new char[] { ${chars} }`;
  }).join(', ');
  return `${indent}char[][] ${varName} = new char[][] { ${rows} };\n`;
}

export function serializeIntMatrix() {
  return `    // Serialize an int[][] to a canonical string representation
    private static String serializeIntMatrix(int[][] matrix) {
        if (matrix == null) return "null";
        if (matrix.length == 0) return "[]";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < matrix.length; i++) {
            if (i > 0) sb.append(", ");
            int[] row = matrix[i];
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
}

export function serializeStringArray() {
  return `    // Serialize a String[] to a JSON-like representation
    private static String serializeStringArray(String[] arr) {
        if (arr == null) return "null";

        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(", ");
            String value = arr[i];
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
        return sb.toString();
    }`;
}

export function serializeStringArrayCoerceEmpty() {
  return String.raw`    // Serialize a String[] to a JSON-like string representation
    private static String serializeStringArray(String[] arr) {
        if (arr == null) return "null";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(", ");
            sb.append("\"").append(escapeJsonString(arr[i])).append("\"");
        }
        sb.append("]");
        return sb.toString();
    }

    private static String escapeJsonString(String value) {
        if (value == null) return "";
        return value
            .replace("\\", "\\\\")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t")
            .replace("\"", "\\\"");
    }`;
}

export function serializeStringMatrix() {
  return `    // Serialize a String[][] to a JSON-like representation
    private static String serializeStringMatrix(String[][] matrix) {
        if (matrix == null) return "null";
        if (matrix.length == 0) return "[]";

        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < matrix.length; i++) {
            if (i > 0) sb.append(", ");
            String[] row = matrix[i];
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
}

export function serializeCharMatrix() {
  return `    // Serialize a char[][] to a canonical string representation
    private static String serializeCharMatrix(char[][] matrix) {
        if (matrix == null) return "null";
        if (matrix.length == 0) return "[]";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < matrix.length; i++) {
            if (i > 0) sb.append(", ");
            char[] row = matrix[i];
            if (row == null) {
                sb.append("null");
                continue;
            }
            sb.append("[");
            for (int j = 0; j < row.length; j++) {
                if (j > 0) sb.append(", ");
                sb.append("'");
                appendEscapedChar(sb, row[j]);
                sb.append("'");
            }
            sb.append("]");
        }
        sb.append("]");
        return sb.toString();
    }

    private static void appendEscapedChar(StringBuilder sb, char ch) {
        if (ch == '\\\\') {
            sb.append("\\\\\\\\");
        } else if (ch == 39) {
            sb.append("\\\\'");
        } else if (ch == '\\n') {
            sb.append("\\\\n");
        } else if (ch == '\\r') {
            sb.append("\\\\r");
        } else if (ch == '\\t') {
            sb.append("\\\\t");
        } else {
            sb.append(ch);
        }
    }`;
}

export function buildStringArrayInputHelper(testCases, fieldName, methodName) {
  return `    private static String[] ${methodName}(int index) {
        String[][] inputs = {
${testCases.map((tc) => {
    const values = Array.isArray(tc[fieldName]) ? tc[fieldName] : [];
    const elements = values.map((value) => {
      if (value === null || value === undefined) {
        return 'null';
      }
      return `"${escapeJavaString(String(value))}"`;
    }).join(', ');
    return `            new String[] { ${elements} }`;
  }).join(',\n')}
        };
        return inputs[index];
    }`;
}
