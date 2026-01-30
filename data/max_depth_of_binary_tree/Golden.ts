class MaxDepthOfBinaryTree {
  maxDepth(root) {
    if (!root) return 0;
    const left = this.maxDepth(root.left);
    const right = this.maxDepth(root.right);
    return Math.max(left, right) + 1;
  }
}
