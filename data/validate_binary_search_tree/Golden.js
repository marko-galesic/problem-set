class ValidateBinarySearchTree {
  isValidBST(root) {
    const validate = (node, min, max) => {
      if (!node) return true;
      if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) {
        return false;
      }
      return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    };
    return validate(root, null, null);
  }
}
