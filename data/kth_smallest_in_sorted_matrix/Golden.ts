class KthSmallestInSortedMatrix {
  kthSmallest(matrix, k) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let low = matrix[0][0];
    let high = matrix[rows - 1][cols - 1];
    const countLessOrEqual = (value) => {
      let row = rows - 1;
      let col = 0;
      let count = 0;
      while (row >= 0 && col < cols) {
        if (matrix[row][col] <= value) {
          count += row + 1;
          col++;
        } else {
          row--;
        }
      }
      return count;
    };
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (countLessOrEqual(mid) < k) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }
}
