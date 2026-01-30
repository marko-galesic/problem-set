class SpiralMatrixTraversal {
    public int[] spiralMatrixTraversal(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return new int[0];
        }
        int m = matrix.length;
        int n = matrix[0].length;
        int[] result = new int[m * n];
        int index = 0;
        int top = 0;
        int bottom = m - 1;
        int left = 0;
        int right = n - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) {
                result[index++] = matrix[top][j];
            }
            top++;
            for (int i = top; i <= bottom; i++) {
                result[index++] = matrix[i][right];
            }
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) {
                    result[index++] = matrix[bottom][j];
                }
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) {
                    result[index++] = matrix[i][left];
                }
                left++;
            }
        }
        return result;
    }
}
