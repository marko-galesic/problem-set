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
class LowestCommonAncestorBst {
    public int lowestCommonAncestorBst(TreeNode root, int p, int q) {
        TreeNode current = root;
        while (current != null) {
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
