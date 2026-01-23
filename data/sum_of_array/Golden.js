class SumOfArray {
  sumOfArray(nums) {
    let sum = 0;
    for (const value of nums) {
      sum += value;
    }
    return sum;
  }
}
