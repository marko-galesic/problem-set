class BinaryTreeInorderTraversal:
    def inorderTraversal(self, root):
        stack = []
        result = []
        current = root
        while current is not None or stack:
            while current is not None:
                stack.append(current)
                current = current.left
            node = stack.pop()
            result.append(node.val)
            current = node.right
        return result
