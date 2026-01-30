/**
 * Adapter for Max Depth Of Binary Tree challenge
 * Handles maxDepth(TreeNode root) method that returns int
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

function buildExpectedIntCode(expected, indent = '        ', varName = 'expected') {
  if (expected === null || expected === undefined) {
    return `${indent}int ${varName} = 0;\n`;
  }
  return `${indent}int ${varName} = ${expected};\n`;
}

export default {
  extractInput: (testCase) => {
    return {
      root: testCase.root !== undefined ? testCase.root : null
    };
  },

  buildExpectedCode: (expected, indent = '        ', varName = 'expected') => {
    return buildExpectedIntCode(expected, indent, varName);
  },

  generateSerializer: () => {
    return `    // Serialize an int to a canonical string representation
    private static String serializeInt(int value) {
        return String.valueOf(value);
    }`;
  },

  generateInvocation: (parserVar) => {
    return `                    TreeNode root = getTestRoot(i);
                    actual = ${parserVar}.maxDepth(root);`;
  },

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

  checkUserDefinedClasses: () => {
    return {};
  },

  generateHelperClasses: () => {
    return '';
  },

  getReturnType: () => 'int',

  getSerializerMethod: () => 'serializeInt',

  getDefaultClassName: () => 'MaxDepthOfBinaryTree',

  preprocessTestCases: (testCases) => testCases
};
