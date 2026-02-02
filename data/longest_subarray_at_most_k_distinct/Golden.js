class LongestSubarrayAtMostKDistinct {
  longestSubarrayAtMostKDistinct(nums, k) {
    if (!nums || k <= 0) {
      return 0;
    }
    const counts = new Map();
    let left = 0;
    let best = 0;
    for (let right = 0; right < nums.length; right++) {
      counts.set(nums[right], (counts.get(nums[right]) || 0) + 1);
      while (counts.size > k) {
        const val = nums[left];
        const next = counts.get(val) - 1;
        if (next === 0) {
          counts.delete(val);
        } else {
          counts.set(val, next);
        }
        left++;
      }
      best = Math.max(best, right - left + 1);
    }
    return best;
  }
}
