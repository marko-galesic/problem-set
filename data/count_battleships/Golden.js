class CountBattleships {
  countBattleships(board) {
    if (!board || board.length === 0 || board[0].length === 0) {
      return 0;
    }
    const m = board.length;
    const n = board[0].length;
    let count = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (board[i][j] !== 'X') {
          continue;
        }
        if (i > 0 && board[i - 1][j] === 'X') {
          continue;
        }
        if (j > 0 && board[i][j - 1] === 'X') {
          continue;
        }
        count++;
      }
    }
    return count;
  }
}
