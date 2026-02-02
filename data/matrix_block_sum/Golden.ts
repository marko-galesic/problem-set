class MatrixBlockSum {
  matrixBlockSum(mat, k) {
    if (!mat || mat.length === 0 || mat[0].length === 0) {
      return [];
    }
    const m = mat.length;
    const n = mat[0].length;
    const ps = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i < m; i++) {
      let rowSum = 0;
      for (let j = 0; j < n; j++) {
        rowSum += mat[i][j];
        ps[i + 1][j + 1] = ps[i][j + 1] + rowSum;
      }
    }
    const result = Array.from({ length: m }, () => Array(n).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const r1 = Math.max(0, i - k);
        const c1 = Math.max(0, j - k);
        const r2 = Math.min(m - 1, i + k);
        const c2 = Math.min(n - 1, j + k);
        result[i][j] = ps[r2 + 1][c2 + 1]
          - ps[r1][c2 + 1]
          - ps[r2 + 1][c1]
          + ps[r1][c1];
      }
    }
    return result;
  }
}
