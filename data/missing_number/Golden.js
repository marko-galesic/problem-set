class MissingNumber {
  missingNumber(nums) {
    let xor = nums.length;
    for (let i = 0; i < nums.length; i++) {
      xor ^= i ^ nums[i];
    }
    return xor;
  }
}
