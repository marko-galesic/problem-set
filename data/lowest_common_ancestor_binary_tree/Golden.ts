class LowestCommonAncestorBinaryTree {
  lowestCommonAncestor(root, p, q) {
    const lca = (node) => {
      if (!node) return null;
      if (node.val === p || node.val === q) return node;
      const left = lca(node.left);
      const right = lca(node.right);
      if (left && right) return node;
      return left || right;
    };
    const node = lca(root);
    return node ? node.val : -1;
  }
}
