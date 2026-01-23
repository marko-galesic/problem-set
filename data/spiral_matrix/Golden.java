class SpiralMatrix {
    public int[] spiralOrder(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0] == null || matrix[0].length == 0) {
            return new int[0];
        }

        int rows = matrix.length;
        int cols = matrix[0].length;
        int[] result = new int[rows * cols];
        int index = 0;
        int top = 0;
        int bottom = rows - 1;
        int left = 0;
        int right = cols - 1;

        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) {
                result[index++] = matrix[top][c];
            }
            top++;

            for (int r = top; r <= bottom; r++) {
                result[index++] = matrix[r][right];
            }
            right--;

            if (top <= bottom) {
                for (int c = right; c >= left; c--) {
                    result[index++] = matrix[bottom][c];
                }
                bottom--;
            }

            if (left <= right) {
                for (int r = bottom; r >= top; r--) {
                    result[index++] = matrix[r][left];
                }
                left++;
            }
        }

        return result;
    }
}
