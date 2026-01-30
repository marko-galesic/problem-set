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
class KthSmallestInBst {
    public int kthSmallestInBst(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;
        int count = 0;
        while (current != null || !stack.isEmpty()) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();
            count++;
            if (count == k) {
                return current.val;
            }
            current = current.right;
        }
        return 0;
    }
}
