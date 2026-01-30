class LowestCommonAncestorBinaryTree {
    public int lowestCommonAncestor(TreeNode root, int p, int q) {
        TreeNode node = lca(root, p, q);
        return node == null ? -1 : node.val;
    }

    private TreeNode lca(TreeNode node, int p, int q) {
        if (node == null) {
            return null;
        }
        if (node.val == p || node.val == q) {
            return node;
        }
        TreeNode left = lca(node.left, p, q);
        TreeNode right = lca(node.right, p, q);
        if (left != null && right != null) {
            return node;
        }
        return left != null ? left : right;
    }
}
