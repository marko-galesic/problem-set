class BinarySearch {
  binarySearch(nums, target) {
    if (!nums || nums.length === 0) {
      return -1;
    }
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      const value = nums[mid];
      if (value === target) {
        return mid;
      }
      if (value < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return -1;
  }
}
