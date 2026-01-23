class FactorialNumber {
  factorialNumber(n) {
    if (n < 0) {
      return 0;
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }
}
