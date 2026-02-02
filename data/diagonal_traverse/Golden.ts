class DiagonalTraverse {
  diagonalTraverse(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
      return [];
    }
    const m = matrix.length;
    const n = matrix[0].length;
    const result = [];
    for (let d = 0; d < m + n - 1; d++) {
      const temp = [];
      let r = d < n ? 0 : d - n + 1;
      let c = d < n ? d : n - 1;
      while (r < m && c >= 0) {
        temp.push(matrix[r][c]);
        r++;
        c--;
      }
      if (d % 2 === 0) {
        temp.reverse();
      }
      result.push(...temp);
    }
    return result;
  }
}
