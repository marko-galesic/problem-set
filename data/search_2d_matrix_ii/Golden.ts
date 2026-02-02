class Search2dMatrixII {
  searchMatrix(matrix, target) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
      return false;
    }
    let row = 0;
    let col = matrix[0].length - 1;
    while (row < matrix.length && col >= 0) {
      const value = matrix[row][col];
      if (value === target) {
        return true;
      }
      if (value > target) {
        col--;
      } else {
        row++;
      }
    }
    return false;
  }
}
