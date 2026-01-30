import java.util.*;

/*
 * TreeNode class is provided as a utility class (see TreeNode.java).
 * Structure:
 *   class TreeNode {
 *       int val;
 *       TreeNode left;
 *       TreeNode right;
 *
 *       TreeNode() {}
 *       TreeNode(int val) { this.val = val; }
 *       TreeNode(int val, TreeNode left, TreeNode right) {
 *           this.val = val;
 *           this.left = left;
 *           this.right = right;
 *       }
 *   }
 */
class LevelOrderTraversal {
    public int[][] levelOrderTraversal(TreeNode root) {
        if (root == null) {
            return new int[0][0];
        }
        List<int[]> levels = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            int[] level = new int[size];
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level[i] = node.val;
                if (node.left != null) queue.add(node.left);
                if (node.right != null) queue.add(node.right);
            }
            levels.add(level);
        }
        return levels.toArray(new int[0][]);
    }
}
