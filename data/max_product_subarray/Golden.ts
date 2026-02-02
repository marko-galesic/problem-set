class MaxProductSubarray {
  maxProductSubarray(nums) {
    if (!nums || nums.length === 0) {
      return 0;
    }
    let maxProd = nums[0];
    let minProd = nums[0];
    let best = nums[0];
    for (let i = 1; i < nums.length; i++) {
      const n = nums[i];
      if (n < 0) {
        const temp = maxProd;
        maxProd = minProd;
        minProd = temp;
      }
      maxProd = Math.max(n, maxProd * n);
      minProd = Math.min(n, minProd * n);
      best = Math.max(best, maxProd);
    }
    return best;
  }
}
