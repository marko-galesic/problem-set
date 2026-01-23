class DiagonalSum {
  diagonalSum(matrix) {
    if (matrix.length === 0) return 0;
    const rows = matrix.length;
    const cols = matrix[0].length;
    const limit = Math.min(rows, cols);
    let sum = 0;
    for (let i = 0; i < limit; i++) {
      sum += matrix[i][i];
    }
    return sum;
  }
}
