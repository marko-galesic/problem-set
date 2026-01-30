class LevelOrderTraversal {
  levelOrderTraversal(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    let index = 0;
    while (index < queue.length) {
      const levelSize = queue.length - index;
      const level = [];
      for (let i = 0; i < levelSize; i++) {
        const node = queue[index++];
        level.push(node.val);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      result.push(level);
    }
    return result;
  }
}
