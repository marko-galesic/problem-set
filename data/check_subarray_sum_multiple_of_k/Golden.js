class CheckSubarraySumMultipleOfK {
  checkSubarraySum(nums, k) {
    if (!nums || nums.length < 2) {
      return false;
    }
    if (k === 0) {
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] === 0 && nums[i - 1] === 0) {
          return true;
        }
      }
      return false;
    }
    const first = new Map();
    first.set(0, -1);
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
      sum += nums[i];
      let mod = sum % k;
      if (mod < 0) {
        mod += k;
      }
      if (first.has(mod)) {
        if (i - first.get(mod) >= 2) {
          return true;
        }
      } else {
        first.set(mod, i);
      }
    }
    return false;
  }
}
