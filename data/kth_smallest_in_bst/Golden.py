class KthSmallestInBst:
    def kthSmallestInBst(self, root, k):
        stack = []
        current = root
        count = 0
        while current is not None or stack:
            while current is not None:
                stack.append(current)
                current = current.left
            current = stack.pop()
            count += 1
            if count == k:
                return current.val
            current = current.right
        return 0
