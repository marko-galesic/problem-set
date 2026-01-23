class ProductOfArray {
  productOfArray(nums) {
    let product = 1;
    for (const value of nums) {
      product *= value;
    }
    return product;
  }
}
