class LongestSubarraySumEqualsK {
  longestSubarraySumEqualsK(nums, k) {
    if (!nums) {
      return 0;
    }
    const first = new Map();
    first.set(0, -1);
    let sum = 0;
    let best = 0;
    for (let i = 0; i < nums.length; i++) {
      sum += nums[i];
      if (first.has(sum - k)) {
        best = Math.max(best, i - first.get(sum - k));
      }
      if (!first.has(sum)) {
        first.set(sum, i);
      }
    }
    return best;
  }
}
