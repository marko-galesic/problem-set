class MaxSumOfMinPairs {
  maxSumOfMinPairs(nums) {
    if (!nums) {
      return 0;
    }
    nums.sort((a, b) => a - b);
    let sum = 0;
    for (let i = 0; i < nums.length; i += 2) {
      sum += nums[i];
    }
    return sum;
  }
}
