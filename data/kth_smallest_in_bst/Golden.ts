class KthSmallestInBst {
  kthSmallestInBst(root, k) {
    const stack = [];
    let current = root;
    let count = 0;
    while (current || stack.length) {
      while (current) {
        stack.push(current);
        current = current.left;
      }
      current = stack.pop();
      count++;
      if (count === k) return current.val;
      current = current.right;
    }
    return 0;
  }
}
