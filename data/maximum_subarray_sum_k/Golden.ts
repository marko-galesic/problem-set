class MaximumSubarraySumK {
  maximumSubarraySumK(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) return 0;
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
      windowSum += nums[i];
    }
    let maxSum = windowSum;
    for (let i = k; i < nums.length; i++) {
      windowSum += nums[i] - nums[i - k];
      if (windowSum > maxSum) maxSum = windowSum;
    }
    return maxSum;
  }
}
