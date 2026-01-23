class CountPositiveInMatrix {
    public int countPositiveInMatrix(int[][] matrix) {
        int count = 0;
        for (int r = 0; r < matrix.length; r++) {
            for (int c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] > 0) count++;
            }
        }
        return count;
    }
}
