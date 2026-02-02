class WordSearchII:
    class Node:
        def __init__(self):
            self.next = [None] * 26
            self.word = None

    def _build_trie(self, words):
        root = WordSearchII.Node()
        for word in words:
            node = root
            for ch in word:
                idx = ord(ch) - 97
                if node.next[idx] is None:
                    node.next[idx] = WordSearchII.Node()
                node = node.next[idx]
            node.word = word
        return root

    def _dfs(self, board, r, c, node, results):
        ch = board[r][c]
        if ch == '#':
            return
        idx = ord(ch) - 97
        next_node = node.next[idx]
        if next_node is None:
            return
        if next_node.word is not None:
            results.append(next_node.word)
            next_node.word = None
        board[r][c] = '#'
        if r > 0:
            self._dfs(board, r - 1, c, next_node, results)
        if c > 0:
            self._dfs(board, r, c - 1, next_node, results)
        if r + 1 < len(board):
            self._dfs(board, r + 1, c, next_node, results)
        if c + 1 < len(board[0]):
            self._dfs(board, r, c + 1, next_node, results)
        board[r][c] = ch

    def findWords(self, board, words):
        root = self._build_trie(words)
        results = []
        for r in range(len(board)):
            for c in range(len(board[0])):
                self._dfs(board, r, c, root, results)
        return sorted(results)
