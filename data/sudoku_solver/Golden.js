class SudokuSolver {
  solveSudoku(board) {
    if (!Array.isArray(board) || board.length === 0) {
      return board;
    }

    const size = 9;
    const rowUsed = Array.from({ length: size }, () => Array(size).fill(false));
    const colUsed = Array.from({ length: size }, () => Array(size).fill(false));
    const boxUsed = Array.from({ length: size }, () => Array(size).fill(false));
    const emptyCells = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const value = board[r][c];
        if (value === '.') {
          emptyCells.push([r, c]);
        } else {
          const digit = value.charCodeAt(0) - '1'.charCodeAt(0);
          if (digit >= 0 && digit < size) {
            rowUsed[r][digit] = true;
            colUsed[c][digit] = true;
            boxUsed[Math.floor(r / 3) * 3 + Math.floor(c / 3)][digit] = true;
          }
        }
      }
    }

    const backtrack = (index) => {
      if (index === emptyCells.length) {
        return true;
      }

      const [r, c] = emptyCells[index];
      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      for (let digit = 0; digit < size; digit++) {
        if (rowUsed[r][digit] || colUsed[c][digit] || boxUsed[box][digit]) {
          continue;
        }

        board[r][c] = String.fromCharCode('1'.charCodeAt(0) + digit);
        rowUsed[r][digit] = true;
        colUsed[c][digit] = true;
        boxUsed[box][digit] = true;

        if (backtrack(index + 1)) {
          return true;
        }

        board[r][c] = '.';
        rowUsed[r][digit] = false;
        colUsed[c][digit] = false;
        boxUsed[box][digit] = false;
      }

      return false;
    };

    backtrack(0);
    return board;
  }
}
