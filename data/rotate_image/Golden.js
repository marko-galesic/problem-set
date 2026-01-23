class RotateImage {
  rotate(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0) {
      return [];
    }
    const n = matrix.length;
    const rotated = Array.from({ length: n }, () => Array(n));
    for (let i = 0; i < n; i++) {
      const row = matrix[i];
      for (let j = 0; j < n; j++) {
        rotated[j][n - 1 - i] = row[j];
      }
    }
    return rotated;
  }
}
