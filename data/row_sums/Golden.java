class RowSums {
    public int[] rowSums(int[][] matrix) {
        int[] result = new int[matrix.length];
        for (int r = 0; r < matrix.length; r++) {
            int sum = 0;
            for (int c = 0; c < matrix[r].length; c++) {
                sum += matrix[r][c];
            }
            result[r] = sum;
        }
        return result;
    }
}
