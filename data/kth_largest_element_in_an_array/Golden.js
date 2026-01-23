class KthLargestElementInAnArray {
  findKthLargest(nums, k) {
    if (!Array.isArray(nums) || nums.length === 0 || k <= 0 || k > nums.length) {
      return 0;
    }
    const sorted = nums.slice().sort((a, b) => b - a);
    return sorted[k - 1];
  }
}
