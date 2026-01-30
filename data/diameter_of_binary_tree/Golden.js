class DiameterOfBinaryTree {
  diameterOfBinaryTree(root) {
    let max = 0;
    const depth = (node) => {
      if (!node) return 0;
      const left = depth(node.left);
      const right = depth(node.right);
      max = Math.max(max, left + right);
      return Math.max(left, right) + 1;
    };
    depth(root);
    return max;
  }
}
