class CountPositiveInMatrix {
  countPositiveInMatrix(matrix) {
    let count = 0;
    for (const row of matrix) {
      for (const value of row) {
        if (value > 0) count++;
      }
    }
    return count;
  }
}
