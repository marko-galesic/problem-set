class AverageOfArray {
  averageOfArray(nums) {
    if (nums.length === 0) return 0;
    let sum = 0;
    for (const value of nums) {
      sum += value;
    }
    return sum / nums.length;
  }
}
