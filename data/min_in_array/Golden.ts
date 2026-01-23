class MinInArray {
  minInArray(nums) {
    if (nums.length === 0) return 0;
    let min = nums[0];
    for (const value of nums) {
      if (value < min) min = value;
    }
    return min;
  }
}
