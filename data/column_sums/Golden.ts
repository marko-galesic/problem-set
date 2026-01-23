class ColumnSums {
  columnSums(matrix) {
    if (matrix.length === 0) return [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = Array(cols).fill(0);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        result[c] += matrix[r][c];
      }
    }
    return result;
  }
}
