class BalancedBinaryTree {
  isBalanced(root) {
    const height = (node) => {
      if (!node) return 0;
      const left = height(node.left);
      if (left === -1) return -1;
      const right = height(node.right);
      if (right === -1) return -1;
      if (Math.abs(left - right) > 1) return -1;
      return Math.max(left, right) + 1;
    };
    return height(root) !== -1;
  }
}
