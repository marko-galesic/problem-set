class RangeSumQueryImmutable {
  rangeSum(nums, left, right) {
    const prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      prefix[i + 1] = prefix[i] + nums[i];
    }
    return prefix[right + 1] - prefix[left];
  }
}
