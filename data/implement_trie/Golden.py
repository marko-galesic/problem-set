class ImplementTrie:
    class Node:
        def __init__(self):
            self.next = [None] * 26
            self.is_word = False

    def trieOps(self, ops, words):
        root = ImplementTrie.Node()

        def insert(word):
            node = root
            for ch in word:
                idx = ord(ch) - 97
                if node.next[idx] is None:
                    node.next[idx] = ImplementTrie.Node()
                node = node.next[idx]
            node.is_word = True

        def search(word):
            node = root
            for ch in word:
                idx = ord(ch) - 97
                if node.next[idx] is None:
                    return False
                node = node.next[idx]
            return node.is_word

        def starts_with(prefix):
            node = root
            for ch in prefix:
                idx = ord(ch) - 97
                if node.next[idx] is None:
                    return False
                node = node.next[idx]
            return True

        results = []
        for op, arg in zip(ops, words):
            if op == "insert":
                insert(arg)
            elif op == "search":
                results.append(1 if search(arg) else 0)
            elif op == "startsWith":
                results.append(1 if starts_with(arg) else 0)
        return results
