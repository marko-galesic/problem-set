import java.util.ArrayList;
import java.util.List;

class SudokuSolver {
    public char[][] solveSudoku(char[][] board) {
        if (board == null || board.length == 0) {
            return board;
        }

        int size = 9;
        boolean[][] rowUsed = new boolean[size][size];
        boolean[][] colUsed = new boolean[size][size];
        boolean[][] boxUsed = new boolean[size][size];
        List<int[]> emptyCells = new ArrayList<>();

        for (int r = 0; r < size; r++) {
            for (int c = 0; c < size; c++) {
                char ch = board[r][c];
                if (ch == '.') {
                    emptyCells.add(new int[] { r, c });
                } else {
                    int digit = ch - '1';
                    if (digit >= 0 && digit < size) {
                        rowUsed[r][digit] = true;
                        colUsed[c][digit] = true;
                        boxUsed[(r / 3) * 3 + (c / 3)][digit] = true;
                    }
                }
            }
        }

        solve(board, emptyCells, 0, rowUsed, colUsed, boxUsed);
        return board;
    }

    private boolean solve(char[][] board, List<int[]> emptyCells, int index,
                          boolean[][] rowUsed, boolean[][] colUsed, boolean[][] boxUsed) {
        if (index == emptyCells.size()) {
            return true;
        }

        int[] cell = emptyCells.get(index);
        int r = cell[0];
        int c = cell[1];
        int box = (r / 3) * 3 + (c / 3);

        for (int digit = 0; digit < 9; digit++) {
            if (rowUsed[r][digit] || colUsed[c][digit] || boxUsed[box][digit]) {
                continue;
            }

            board[r][c] = (char) ('1' + digit);
            rowUsed[r][digit] = true;
            colUsed[c][digit] = true;
            boxUsed[box][digit] = true;

            if (solve(board, emptyCells, index + 1, rowUsed, colUsed, boxUsed)) {
                return true;
            }

            board[r][c] = '.';
            rowUsed[r][digit] = false;
            colUsed[c][digit] = false;
            boxUsed[box][digit] = false;
        }

        return false;
    }
}
