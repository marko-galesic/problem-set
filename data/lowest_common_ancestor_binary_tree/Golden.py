class LowestCommonAncestorBinaryTree:
    def lowestCommonAncestor(self, root, p, q):
        def lca(node):
            if node is None:
                return None
            if node.val == p or node.val == q:
                return node
            left = lca(node.left)
            right = lca(node.right)
            if left and right:
                return node
            return left if left else right

        node = lca(root)
        return node.val if node else -1
