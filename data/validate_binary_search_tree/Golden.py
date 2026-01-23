class ValidateBinarySearchTree:
    def isValidBST(self, root):
        def validate(node, low, high):
            if node is None:
                return True
            if (low is not None and node.val <= low) or (high is not None and node.val >= high):
                return False
            return validate(node.left, low, node.val) and validate(node.right, node.val, high)

        return validate(root, None, None)
