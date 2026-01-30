class SumOfDigitSquares {
  sumOfDigitSquares(n) {
    n = Math.abs(n);
    let sum = 0;
    while (n > 0) {
      const digit = n % 10;
      sum += digit * digit;
      n = Math.floor(n / 10);
    }
    return sum;
  }
}
