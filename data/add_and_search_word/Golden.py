class AddAndSearchWord:
    class Node:
        def __init__(self):
            self.next = [None] * 26
            self.is_word = False

    def wordDictionaryOps(self, ops, words):
        root = AddAndSearchWord.Node()

        def add(word):
            node = root
            for ch in word:
                idx = ord(ch) - 97
                if node.next[idx] is None:
                    node.next[idx] = AddAndSearchWord.Node()
                node = node.next[idx]
            node.is_word = True

        def search(node, word, index):
            if node is None:
                return False
            if index == len(word):
                return node.is_word
            ch = word[index]
            if ch == '.':
                for child in node.next:
                    if child is not None and search(child, word, index + 1):
                        return True
                return False
            idx = ord(ch) - 97
            return search(node.next[idx], word, index + 1)

        results = []
        for op, arg in zip(ops, words):
            if op == "add":
                add(arg)
            elif op == "search":
                results.append(1 if search(root, arg, 0) else 0)
        return results
