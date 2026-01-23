class RemoveDuplicatesFromSortedArray {
  removeDuplicates(nums) {
    if (!nums || nums.length === 0) {
      return 0;
    }
    let write = 1;
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] !== nums[write - 1]) {
        nums[write] = nums[i];
        write += 1;
      }
    }
    return write;
  }
}
