class MaximumSubarray {
  maxSubArray(nums) {
    if (!nums || nums.length === 0) {
      return 0;
    }
    let current = nums[0];
    let best = nums[0];
    for (let i = 1; i < nums.length; i++) {
      const value = nums[i];
      current = Math.max(value, current + value);
      if (current > best) {
        best = current;
      }
    }
    return best;
  }
}
