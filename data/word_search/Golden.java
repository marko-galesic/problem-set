class WordSearch {
    public boolean exist(char[][] board, String word) {
        if (word == null) {
            return false;
        }
        if (word.length() == 0) {
            return true;
        }
        if (board == null || board.length == 0 || board[0].length == 0) {
            return false;
        }

        int rows = board.length;
        int cols = board[0].length;
        if (word.length() > rows * cols) {
            return false;
        }

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(board, word, 0, r, c)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean dfs(char[][] board, String word, int index, int r, int c) {
        if (index == word.length()) {
            return true;
        }
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) {
            return false;
        }
        if (board[r][c] != word.charAt(index)) {
            return false;
        }

        char temp = board[r][c];
        board[r][c] = '#';

        boolean found = dfs(board, word, index + 1, r + 1, c)
            || dfs(board, word, index + 1, r - 1, c)
            || dfs(board, word, index + 1, r, c + 1)
            || dfs(board, word, index + 1, r, c - 1);

        board[r][c] = temp;
        return found;
    }
}
