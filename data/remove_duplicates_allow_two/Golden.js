class RemoveDuplicatesAllowTwo {
  removeDuplicatesAllowTwo(nums) {
    if (!nums || nums.length === 0) {
      return 0;
    }
    let count = 1;
    let length = 1;
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] === nums[i - 1]) {
        count++;
      } else {
        count = 1;
      }
      if (count <= 2) {
        length++;
      }
    }
    return length;
  }
}
