class ReplaceWords:
    class Node:
        def __init__(self):
            self.next = [None] * 26
            self.is_word = False

    def _build_trie(self, dictionary):
        root = ReplaceWords.Node()
        for word in dictionary:
            node = root
            for ch in word:
                idx = ord(ch) - 97
                if node.next[idx] is None:
                    node.next[idx] = ReplaceWords.Node()
                node = node.next[idx]
            node.is_word = True
        return root

    def _replace_word(self, root, word):
        node = root
        prefix = []
        for ch in word:
            idx = ord(ch) - 97
            if node.next[idx] is None:
                return word
            node = node.next[idx]
            prefix.append(ch)
            if node.is_word:
                return "".join(prefix)
        return word

    def replaceWords(self, dictionary, sentence):
        root = self._build_trie(dictionary)
        parts = sentence.split(" ")
        replaced = [self._replace_word(root, part) for part in parts]
        return " ".join(replaced)
