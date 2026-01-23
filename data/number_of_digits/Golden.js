class NumberOfDigits {
  numberOfDigits(n) {
    let value = Math.abs(n);
    if (value === 0) {
      return 1;
    }
    let count = 0;
    while (value > 0) {
      count++;
      value = Math.floor(value / 10);
    }
    return count;
  }
}
