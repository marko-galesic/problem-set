class TransposeMatrix {
  transposeMatrix(matrix) {
    if (matrix.length === 0) return [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = Array.from({ length: cols }, () => Array(rows));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        result[c][r] = matrix[r][c];
      }
    }
    return result;
  }
}
