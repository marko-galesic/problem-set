/**
 * Adapter for Lowest Common Ancestor (Binary Tree) challenge
 * Handles lowestCommonAncestor(TreeNode root, int p, int q) method that returns int
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
      root: testCase.root !== undefined ? testCase.root : null,
      p: testCase.p !== undefined ? testCase.p : 0,
      q: testCase.q !== undefined ? testCase.q : 0
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
                    int p = getTestP(i);
                    int q = getTestQ(i);
                    actual = ${parserVar}.lowestCommonAncestor(root, p, q);`;
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

    private static int getTestP(int index) {
        int[] values = {
${testCases.map(tc => `            ${tc.p !== undefined ? tc.p : 0}`).join(',\n')}
        };
        return values[index];
    }

    private static int getTestQ(int index) {
        int[] values = {
${testCases.map(tc => `            ${tc.q !== undefined ? tc.q : 0}`).join(',\n')}
        };
        return values[index];
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

  getDefaultClassName: () => 'LowestCommonAncestorBinaryTree',

  preprocessTestCases: (testCases) => testCases
};
