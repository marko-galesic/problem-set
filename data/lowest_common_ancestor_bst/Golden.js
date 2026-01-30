class LowestCommonAncestorBst {
  lowestCommonAncestorBst(root, p, q) {
    let current = root;
    while (current) {
      if (p < current.val && q < current.val) {
        current = current.left;
      } else if (p > current.val && q > current.val) {
        current = current.right;
      } else {
        return current.val;
      }
    }
    return 0;
  }
}
