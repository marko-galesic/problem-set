class ReverseDigits {
  reverseDigits(n) {
    const sign = n < 0 ? -1 : 1;
    let value = Math.abs(n);
    let reversed = 0;
    while (value > 0) {
      reversed = (reversed * 10) + (value % 10);
      value = Math.floor(value / 10);
    }
    return sign * reversed;
  }
}
