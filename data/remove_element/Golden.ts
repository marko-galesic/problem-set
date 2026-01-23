class RemoveElement {
  removeElement(nums, val) {
    if (!nums || nums.length === 0) {
      return 0;
    }
    let write = 0;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] !== val) {
        nums[write] = nums[i];
        write += 1;
      }
    }
    return write;
  }
}
