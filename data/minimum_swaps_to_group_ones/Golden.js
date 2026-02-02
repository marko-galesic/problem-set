class MinimumSwapsToGroupOnes {
  minimumSwapsToGroupOnes(nums) {
    if (!nums || nums.length === 0) {
      return 0;
    }
    let ones = 0;
    for (const n of nums) {
      if (n === 1) {
        ones++;
      }
    }
    if (ones <= 1) {
      return 0;
    }
    let zeros = 0;
    for (let i = 0; i < ones; i++) {
      if (nums[i] === 0) {
        zeros++;
      }
    }
    let best = zeros;
    for (let i = ones; i < nums.length; i++) {
      if (nums[i] === 0) {
        zeros++;
      }
      if (nums[i - ones] === 0) {
        zeros--;
      }
      if (zeros < best) {
        best = zeros;
      }
    }
    return best;
  }
}
