class LongestMountainInArray {
  longestMountainInArray(nums) {
    if (!nums || nums.length < 3) {
      return 0;
    }
    const n = nums.length;
    let best = 0;
    let i = 1;
    while (i < n - 1) {
      if (nums[i - 1] < nums[i] && nums[i] > nums[i + 1]) {
        let left = i - 1;
        let right = i + 1;
        while (left > 0 && nums[left - 1] < nums[left]) {
          left--;
        }
        while (right < n - 1 && nums[right] > nums[right + 1]) {
          right++;
        }
        best = Math.max(best, right - left + 1);
        i = right;
      }
      i++;
    }
    return best;
  }
}
