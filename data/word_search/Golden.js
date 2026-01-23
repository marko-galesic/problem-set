class WordSearch {
  exist(board, word) {
    if (word === null || word === undefined) {
      return false;
    }
    if (word.length === 0) {
      return true;
    }
    if (!Array.isArray(board) || board.length === 0 || board[0].length === 0) {
      return false;
    }

    const rows = board.length;
    const cols = board[0].length;
    if (word.length > rows * cols) {
      return false;
    }

    const dfs = (r, c, index) => {
      if (index === word.length) {
        return true;
      }
      if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return false;
      }
      if (board[r][c] !== word[index]) {
        return false;
      }

      const temp = board[r][c];
      board[r][c] = '#';

      const found = dfs(r + 1, c, index + 1)
        || dfs(r - 1, c, index + 1)
        || dfs(r, c + 1, index + 1)
        || dfs(r, c - 1, index + 1);

      board[r][c] = temp;
      return found;
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (dfs(r, c, 0)) {
          return true;
        }
      }
    }

    return false;
  }
}
