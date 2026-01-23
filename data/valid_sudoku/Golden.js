class ValidSudoku {
  isValidSudoku(board) {
    if (!Array.isArray(board) || board.length !== 9) {
      return false;
    }

    const rows = Array.from({ length: 9 }, () => Array(9).fill(false));
    const cols = Array.from({ length: 9 }, () => Array(9).fill(false));
    const boxes = Array.from({ length: 9 }, () => Array(9).fill(false));
    const base = '1'.charCodeAt(0);

    for (let r = 0; r < 9; r++) {
      if (!Array.isArray(board[r]) || board[r].length !== 9) {
        return false;
      }
      for (let c = 0; c < 9; c++) {
        const value = board[r][c];
        if (value === '.') {
          continue;
        }
        if (typeof value !== 'string' || value.length !== 1) {
          return false;
        }
        const num = value.charCodeAt(0) - base;
        if (num < 0 || num > 8) {
          return false;
        }
        const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        if (rows[r][num] || cols[c][num] || boxes[box][num]) {
          return false;
        }
        rows[r][num] = true;
        cols[c][num] = true;
        boxes[box][num] = true;
      }
    }

    return true;
  }
}
