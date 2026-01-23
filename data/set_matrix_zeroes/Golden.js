class SetMatrixZeroes {
  setZeroes(matrix) {
    if (!Array.isArray(matrix)) {
      return null;
    }
    if (matrix.length === 0) {
      return [];
    }

    const rows = matrix.length;
    const cols = Array.isArray(matrix[0]) ? matrix[0].length : 0;
    const zeroRows = new Array(rows).fill(false);
    const zeroCols = new Array(cols).fill(false);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c] === 0) {
          zeroRows[r] = true;
          zeroCols[c] = true;
        }
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (zeroRows[r] || zeroCols[c]) {
          matrix[r][c] = 0;
        }
      }
    }

    return matrix;
  }
}
