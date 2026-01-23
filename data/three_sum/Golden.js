class ThreeSum {
  threeSum(nums) {
    if (!Array.isArray(nums) || nums.length < 3) {
      return [];
    }

    nums.sort((a, b) => a - b);
    const results = [];

    for (let i = 0; i < nums.length - 2; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) {
        continue;
      }
      if (nums[i] > 0) {
        break;
      }

      let left = i + 1;
      let right = nums.length - 1;

      while (left < right) {
        const sum = nums[i] + nums[left] + nums[right];
        if (sum === 0) {
          results.push([nums[i], nums[left], nums[right]]);
          const leftVal = nums[left];
          const rightVal = nums[right];
          while (left < right && nums[left] === leftVal) {
            left += 1;
          }
          while (left < right && nums[right] === rightVal) {
            right -= 1;
          }
        } else if (sum < 0) {
          left += 1;
        } else {
          right -= 1;
        }
      }
    }

    return results;
  }
}
