class MaximumXorOfTwoNumbers:
    class Node:
        def __init__(self):
            self.next = [None, None]

    def _insert(self, root, num):
        node = root
        for i in range(31, -1, -1):
            bit = (num >> i) & 1
            if node.next[bit] is None:
                node.next[bit] = MaximumXorOfTwoNumbers.Node()
            node = node.next[bit]

    def _query(self, root, num):
        node = root
        value = 0
        for i in range(31, -1, -1):
            bit = (num >> i) & 1
            want = bit ^ 1
            if node.next[want] is not None:
                value |= (1 << i)
                node = node.next[want]
            else:
                node = node.next[bit]
        return value

    def findMaximumXOR(self, nums):
        root = MaximumXorOfTwoNumbers.Node()
        for num in nums:
            self._insert(root, num)
        max_val = 0
        for num in nums:
            max_val = max(max_val, self._query(root, num))
        return max_val
