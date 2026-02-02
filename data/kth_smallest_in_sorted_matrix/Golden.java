class KthSmallestInSortedMatrix {
    public int kthSmallest(int[][] matrix, int k) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int low = matrix[0][0];
        int high = matrix[rows - 1][cols - 1];
        while (low < high) {
            int mid = low + (high - low) / 2;
            int count = countLessOrEqual(matrix, mid);
            if (count < k) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }

    private int countLessOrEqual(int[][] matrix, int value) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int row = rows - 1;
        int col = 0;
        int count = 0;
        while (row >= 0 && col < cols) {
            if (matrix[row][col] <= value) {
                count += row + 1;
                col++;
            } else {
                row--;
            }
        }
        return count;
    }
}
