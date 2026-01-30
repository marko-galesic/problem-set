class BinaryTreeInorderTraversal {
  inorderTraversal(root) {
    const stack = [];
    const result = [];
    let current = root;
    while (current || stack.length) {
      while (current) {
        stack.push(current);
        current = current.left;
      }
      const node = stack.pop();
      result.push(node.val);
      current = node.right;
    }
    return result;
  }
}
