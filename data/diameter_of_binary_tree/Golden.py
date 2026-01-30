class DiameterOfBinaryTree:
    def diameterOfBinaryTree(self, root):
        max_diameter = 0

        def depth(node):
            nonlocal max_diameter
            if node is None:
                return 0
            left = depth(node.left)
            right = depth(node.right)
            max_diameter = max(max_diameter, left + right)
            return max(left, right) + 1

        depth(root)
        return max_diameter
