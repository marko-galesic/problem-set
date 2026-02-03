class MaximumSumCircularSubarray {
  maxSubarraySumCircular(nums) {
    if (!nums || nums.length === 0) {
      return 0;
    }
    let total = 0;
    let maxSum = nums[0];
    let curMax = 0;
    let minSum = nums[0];
    let curMin = 0;
    for (const n of nums) {
      curMax = Math.max(curMax + n, n);
      maxSum = Math.max(maxSum, curMax);
      curMin = Math.min(curMin + n, n);
      minSum = Math.min(minSum, curMin);
      total += n;
    }
    if (maxSum < 0) {
      return maxSum;
    }
    return Math.max(maxSum, total - minSum);
  }
}
