/**
 * Adapter for Validate Binary Search Tree challenge
 * Handles isValidBST(TreeNode root) method that returns boolean
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

// Convert expected boolean to Java code
function buildExpectedBooleanCode(expected, indent = '        ', varName = 'expected') {
  if (expected === null || expected === undefined) {
    return `${indent}boolean ${varName} = false;\n`;
  }
  return `${indent}boolean ${varName} = ${expected};\n`;
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
    return buildExpectedBooleanCode(expected, indent, varName);
  },

  // Generate Java code to serialize result
  generateSerializer: () => {
    return `    // Serialize a boolean to a canonical string representation
    private static String serializeBoolean(boolean value) {
        return String.valueOf(value);
    }`;
  },

  // Generate Java code to invoke the user's method
  generateInvocation: (parserVar) => {
    return `                    TreeNode root = getTestRoot(i);
                    actual = ${parserVar}.isValidBST(root);`;
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

  // Check if user code defines required classes/types (not needed for Validate BST)
  checkUserDefinedClasses: () => {
    return {};
  },

  // Generate required helper classes/types if not in user code (not needed)
  generateHelperClasses: () => {
    return '';
  },

  // Get the return type name for this challenge
  getReturnType: () => 'boolean',

  // Get the serializer method name
  getSerializerMethod: () => 'serializeBoolean',

  // Get default class name for this challenge
  getDefaultClassName: () => 'ValidateBinarySearchTree',

  // Preprocess test cases (no preprocessing needed)
  preprocessTestCases: (testCases) => testCases
};
