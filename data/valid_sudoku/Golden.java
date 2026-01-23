class ValidSudoku {
    public boolean isValidSudoku(char[][] board) {
        if (board == null || board.length != 9) {
            return false;
        }

        boolean[][] rows = new boolean[9][9];
        boolean[][] cols = new boolean[9][9];
        boolean[][] boxes = new boolean[9][9];

        for (int r = 0; r < 9; r++) {
            if (board[r] == null || board[r].length != 9) {
                return false;
            }
            for (int c = 0; c < 9; c++) {
                char value = board[r][c];
                if (value == '.') {
                    continue;
                }
                if (value < '1' || value > '9') {
                    return false;
                }
                int num = value - '1';
                int box = (r / 3) * 3 + (c / 3);
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
