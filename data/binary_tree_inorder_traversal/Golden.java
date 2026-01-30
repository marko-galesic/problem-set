class BinaryTreeInorderTraversal {
    public int[] inorderTraversal(TreeNode root) {
        java.util.ArrayDeque<TreeNode> stack = new java.util.ArrayDeque<>();
        java.util.ArrayList<Integer> result = new java.util.ArrayList<>();
        TreeNode current = root;
        while (current != null || !stack.isEmpty()) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            TreeNode node = stack.pop();
            result.add(node.val);
            current = node.right;
        }
        int[] output = new int[result.size()];
        for (int i = 0; i < result.size(); i++) {
            output[i] = result.get(i);
        }
        return output;
    }
}
