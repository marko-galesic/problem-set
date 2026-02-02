class MinimumSizeSubarraySum {
  minSubArrayLen(target, nums) {
    if (!nums) {
      return 0;
    }
    let left = 0;
    let sum = 0;
    let best = Infinity;
    for (let right = 0; right < nums.length; right++) {
      sum += nums[right];
      while (sum >= target) {
        best = Math.min(best, right - left + 1);
        sum -= nums[left++];
      }
    }
    return best === Infinity ? 0 : best;
  }
}
