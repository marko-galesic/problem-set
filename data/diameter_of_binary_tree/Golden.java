class DiameterOfBinaryTree {
    public int diameterOfBinaryTree(TreeNode root) {
        int[] max = new int[1];
        depth(root, max);
        return max[0];
    }

    private int depth(TreeNode node, int[] max) {
        if (node == null) {
            return 0;
        }
        int left = depth(node.left, max);
        int right = depth(node.right, max);
        max[0] = Math.max(max[0], left + right);
        return Math.max(left, right) + 1;
    }
}
