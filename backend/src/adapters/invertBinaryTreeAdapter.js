/**
 * Adapter for Invert Binary Tree challenge
 * Handles invertTree(TreeNode root) method that returns TreeNode
 *
 * Note: TreeNode.java is always provided as a top-level utility file.
 */

function buildIntegerArrayLiteral(values) {
  if (!Array.isArray(values)) {
    return 'null';
  }

  if (values.length === 0) {
    return 'new Integer[] {}';
  }

  const items = values.map((value) => {
    if (value === null || value === undefined) {
      return 'null';
    }
    return Number.isFinite(value) ? String(value) : 'null';
  });

  return `new Integer[] { ${items.join(', ')} }`;
}

function buildExpectedTreeCode(expected, indent = '        ', varName = 'expected') {
  if (!expected || !Array.isArray(expected) || expected.length === 0) {
    return `${indent}TreeNode ${varName} = null;\n`;
  }

  const arrayLiteral = buildIntegerArrayLiteral(expected);
  return `${indent}Integer[] expectedValues = ${arrayLiteral};\n` +
    `${indent}TreeNode ${varName} = buildTree(expectedValues);\n`;
}

export default {
  // Extract input from test case
  extractInput: (testCase) => {
    return {
      root: testCase.root !== undefined ? testCase.root : null
    };
  },

  // Build Java code that creates the expected result
  buildExpectedCode: (expected, indent = '        ', varName = 'expected') => {
    return buildExpectedTreeCode(expected, indent, varName);
  },

  // Generate Java code to serialize result
  generateSerializer: () => {
    return `    // Serialize a TreeNode to a canonical level-order string
    private static String serializeTreeNode(TreeNode root) {
        if (root == null) return "null";

        java.util.List<String> values = new java.util.ArrayList<>();
        java.util.Queue<TreeNode> queue = new java.util.LinkedList<>();
        queue.add(root);

        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) {
                values.add("null");
            } else {
                values.add(String.valueOf(node.val));
                queue.add(node.left);
                queue.add(node.right);
            }
        }

        int last = values.size() - 1;
        while (last >= 0 && "null".equals(values.get(last))) {
            last--;
        }

        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i <= last; i++) {
            if (i > 0) sb.append(", ");
            sb.append(values.get(i));
        }
        sb.append("]");
        return sb.toString();
    }`;
  },

  // Generate Java code to invoke the user's method
  generateInvocation: (parserVar) => {
    return `                    TreeNode root = getTestRoot(i);
                    actual = ${parserVar}.invertTree(root);`;
  },

  // Generate helper methods for test input
  generateInputHelpers: (testCases) => {
    const buildCaseCode = testCases.map((tc, idx) => {
      const root = tc.root !== undefined ? tc.root : null;
      if (!root || !Array.isArray(root) || root.length === 0) {
        return `        if (index == ${idx}) return null;`;
      }

      const arrayLiteral = buildIntegerArrayLiteral(root);
      return `        if (index == ${idx}) return buildTree(${arrayLiteral});`;
    }).join('\n');

    return `    private static TreeNode getTestRoot(int index) {
${buildCaseCode}
        return null;
    }

    private static TreeNode buildTree(Integer[] values) {
        if (values == null || values.length == 0) return null;
        TreeNode root = new TreeNode(values[0]);
        java.util.Queue<TreeNode> queue = new java.util.LinkedList<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < values.length) {
            TreeNode current = queue.poll();
            if (current == null) {
                continue;
            }
            if (i < values.length && values[i] != null) {
                current.left = new TreeNode(values[i]);
                queue.add(current.left);
            }
            i++;
            if (i < values.length && values[i] != null) {
                current.right = new TreeNode(values[i]);
                queue.add(current.right);
            }
            i++;
        }
        return root;
    }`;
  },

  // Check if user code defines required classes/types (not needed for Invert Binary Tree)
  checkUserDefinedClasses: () => {
    return {};
  },

  // Generate required helper classes/types if not in user code (not needed)
  generateHelperClasses: () => {
    return '';
  },

  // Get the return type name for this challenge
  getReturnType: () => 'TreeNode',

  // Get the serializer method name
  getSerializerMethod: () => 'serializeTreeNode',

  // Get default class name for this challenge
  getDefaultClassName: () => 'InvertBinaryTree',

  // Preprocess test cases (no preprocessing needed)
  preprocessTestCases: (testCases) => testCases
};
