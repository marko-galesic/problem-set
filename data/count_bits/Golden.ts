class CountBits {
  countBits(n) {
    let value = Math.abs(n);
    let count = 0;
    while (value > 0) {
      count += value % 2;
      value = Math.floor(value / 2);
    }
    return count;
  }
}
