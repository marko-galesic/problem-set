class FindDuplicateNumber {
  findDuplicate(nums) {
    if (!nums || nums.length === 0) {
      return 0;
    }
    let slow = nums[0];
    let fast = nums[0];
    do {
      slow = nums[slow];
      fast = nums[nums[fast]];
    } while (slow !== fast);
    let finder = nums[0];
    while (finder !== slow) {
      finder = nums[finder];
      slow = nums[slow];
    }
    return finder;
  }
}
