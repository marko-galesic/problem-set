class StreamOfCharacters:
    class Node:
        def __init__(self):
            self.next = [None] * 26
            self.is_word = False

    def _build_trie(self, words):
        root = StreamOfCharacters.Node()
        for word in words:
            node = root
            for ch in reversed(word):
                idx = ord(ch) - 97
                if node.next[idx] is None:
                    node.next[idx] = StreamOfCharacters.Node()
                node = node.next[idx]
            node.is_word = True
        return root

    def streamQueries(self, words, queries):
        root = self._build_trie(words)
        max_len = 0
        for w in words:
            max_len = max(max_len, len(w))
        stream = []
        results = []
        for q in queries:
            stream.append(q[0])
            if len(stream) > max_len:
                stream = stream[-max_len:]
            node = root
            found = False
            for ch in reversed(stream):
                idx = ord(ch) - 97
                node = node.next[idx]
                if node is None:
                    break
                if node.is_word:
                    found = True
                    break
            results.append(1 if found else 0)
        return results
