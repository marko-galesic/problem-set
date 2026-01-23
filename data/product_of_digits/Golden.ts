class ProductOfDigits {
  productOfDigits(n) {
    let value = Math.abs(n);
    if (value === 0) {
      return 0;
    }
    let product = 1;
    while (value > 0) {
      product *= value % 10;
      value = Math.floor(value / 10);
    }
    return product;
  }
}
