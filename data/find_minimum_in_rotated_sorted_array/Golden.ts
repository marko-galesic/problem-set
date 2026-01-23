class FindMinimumInRotatedSortedArray {
  findMin(nums) {
    if (!nums || nums.length === 0) {
      return 0;
    }
    let left = 0;
    let right = nums.length - 1;
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] > nums[right]) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return nums[left];
  }
}
