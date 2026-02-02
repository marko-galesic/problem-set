class MapSumPairs:
    class Node:
        def __init__(self):
            self.next = [None] * 26
            self.sum = 0

    def mapSumOps(self, ops, keys, vals):
        root = MapSumPairs.Node()
        values = {}

        def insert(key, val):
            delta = val - values.get(key, 0)
            values[key] = val
            node = root
            node.sum += delta
            for ch in key:
                idx = ord(ch) - 97
                if node.next[idx] is None:
                    node.next[idx] = MapSumPairs.Node()
                node = node.next[idx]
                node.sum += delta

        def sum_prefix(prefix):
            node = root
            for ch in prefix:
                idx = ord(ch) - 97
                if node.next[idx] is None:
                    return 0
                node = node.next[idx]
            return node.sum

        results = []
        for i, op in enumerate(ops):
            if op == "insert":
                insert(keys[i], vals[i])
            elif op == "sum":
                results.append(sum_prefix(keys[i]))
        return results
