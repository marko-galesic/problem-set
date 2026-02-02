class WordSearchII {
  _buildTrie(words) {
    const root = { next: new Array(26).fill(null), word: null };
    for (const word of words) {
      let node = root;
      for (let i = 0; i < word.length; i++) {
        const idx = word.charCodeAt(i) - 97;
        if (!node.next[idx]) {
          node.next[idx] = { next: new Array(26).fill(null), word: null };
        }
        node = node.next[idx];
      }
      node.word = word;
    }
    return root;
  }

  _dfs(board, r, c, node, results) {
    const ch = board[r][c];
    if (ch === '#') {
      return;
    }
    const idx = ch.charCodeAt(0) - 97;
    const nextNode = node.next[idx];
    if (!nextNode) {
      return;
    }
    if (nextNode.word !== null) {
      results.push(nextNode.word);
      nextNode.word = null;
    }
    board[r][c] = '#';
    if (r > 0) {
      this._dfs(board, r - 1, c, nextNode, results);
    }
    if (c > 0) {
      this._dfs(board, r, c - 1, nextNode, results);
    }
    if (r + 1 < board.length) {
      this._dfs(board, r + 1, c, nextNode, results);
    }
    if (c + 1 < board[0].length) {
      this._dfs(board, r, c + 1, nextNode, results);
    }
    board[r][c] = ch;
  }

  findWords(board, words) {
    const root = this._buildTrie(words);
    const results = [];
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
        this._dfs(board, r, c, root, results);
      }
    }
    results.sort();
    return results;
  }
}
