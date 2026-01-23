class CountNegativeNumbers {
  countNegativeNumbers(nums) {
    let count = 0;
    for (const value of nums) {
      if (value < 0) count++;
    }
    return count;
  }
}
