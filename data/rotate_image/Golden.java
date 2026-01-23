class RotateImage {
    public int[][] rotate(int[][] matrix) {
        if (matrix == null) {
            return null;
        }
        int n = matrix.length;
        if (n == 0) {
            return new int[0][0];
        }
        int[][] rotated = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                rotated[j][n - 1 - i] = matrix[i][j];
            }
        }
        return rotated;
    }
}
