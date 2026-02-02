class SubarrayProductLessThanK {
  numSubarrayProductLessThanK(nums, k) {
    if (k <= 1) {
      return 0;
    }
    let product = 1;
    let left = 0;
    let count = 0;
    for (let right = 0; right < nums.length; right++) {
      product *= nums[right];
      while (product >= k && left <= right) {
        product /= nums[left++];
      }
      count += right - left + 1;
    }
    return count;
  }
}
