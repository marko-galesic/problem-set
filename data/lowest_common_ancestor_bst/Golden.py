class LowestCommonAncestorBst:
    def lowestCommonAncestorBst(self, root, p, q):
        current = root
        while current is not None:
            if p < current.val and q < current.val:
                current = current.left
            elif p > current.val and q > current.val:
                current = current.right
            else:
                return current.val
        return 0
