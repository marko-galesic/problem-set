class SumOfDigits {
  sumOfDigits(n) {
    let value = Math.abs(n);
    let sum = 0;
    while (value > 0) {
      sum += value % 10;
      value = Math.floor(value / 10);
    }
    return sum;
  }
}
