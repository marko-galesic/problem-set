class RotateLeftByOne {
  rotateLeftByOne(nums) {
    if (nums.length <= 1) return nums.slice();
    return nums.slice(1).concat(nums[0]);
  }
}
