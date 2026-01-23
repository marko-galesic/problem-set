class DiagonalSum {
    public int diagonalSum(int[][] matrix) {
        if (matrix.length == 0) return 0;
        int rows = matrix.length;
        int cols = matrix[0].length;
        int limit = Math.min(rows, cols);
        int sum = 0;
        for (int i = 0; i < limit; i++) {
            sum += matrix[i][i];
        }
        return sum;
    }
}
