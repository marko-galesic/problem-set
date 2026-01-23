class RowSums {
  rowSums(matrix) {
    const result = [];
    for (const row of matrix) {
      let sum = 0;
      for (const value of row) {
        sum += value;
      }
      result.push(sum);
    }
    return result;
  }
}
