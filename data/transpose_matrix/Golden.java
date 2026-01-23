class TransposeMatrix {
    public int[][] transposeMatrix(int[][] matrix) {
        if (matrix.length == 0) return new int[0][0];
        int rows = matrix.length;
        int cols = matrix[0].length;
        int[][] result = new int[cols][rows];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                result[c][r] = matrix[r][c];
            }
        }
        return result;
    }
}
