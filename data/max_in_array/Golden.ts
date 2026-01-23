class MaxInArray {
  maxInArray(nums) {
    if (nums.length === 0) return 0;
    let max = nums[0];
    for (const value of nums) {
      if (value > max) max = value;
    }
    return max;
  }
}
