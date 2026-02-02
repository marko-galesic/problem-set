class SpiralMatrixII {
    public int[][] generateMatrix(int n) {
        int[][] result = new int[n][n];
        int top = 0;
        int bottom = n - 1;
        int left = 0;
        int right = n - 1;
        int value = 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) {
                result[top][j] = value++;
            }
            top++;
            for (int i = top; i <= bottom; i++) {
                result[i][right] = value++;
            }
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) {
                    result[bottom][j] = value++;
                }
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) {
                    result[i][left] = value++;
                }
                left++;
            }
        }
        return result;
    }
}
