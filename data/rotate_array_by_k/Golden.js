class RotateArrayByK {
  rotateArrayByK(nums, k) {
    if (!nums || nums.length === 0) {
      return [];
    }
    const n = nums.length;
    const shift = ((k % n) + n) % n;
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
      result[(i + shift) % n] = nums[i];
    }
    return result;
  }
}
