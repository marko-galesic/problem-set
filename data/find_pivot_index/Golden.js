class FindPivotIndex {
  pivotIndex(nums) {
    let total = 0;
    for (const n of nums) total += n;
    let left = 0;
    for (let i = 0; i < nums.length; i++) {
      if (left === total - left - nums[i]) return i;
      left += nums[i];
    }
    return -1;
  }
}
