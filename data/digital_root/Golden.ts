class DigitalRoot {
  digitalRoot(n) {
    let value = Math.abs(n);
    while (value >= 10) {
      let sum = 0;
      while (value > 0) {
        sum += value % 10;
        value = Math.floor(value / 10);
      }
      value = sum;
    }
    return value;
  }
}
