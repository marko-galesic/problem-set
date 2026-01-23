class FourSum {
  fourSum(nums, target) {
    if (!Array.isArray(nums) || nums.length < 4) {
      return [];
    }

    nums.sort((a, b) => a - b);
    const results = [];
    const n = nums.length;

    for (let i = 0; i < n - 3; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) {
        continue;
      }
      for (let j = i + 1; j < n - 2; j++) {
        if (j > i + 1 && nums[j] === nums[j - 1]) {
          continue;
        }
        let left = j + 1;
        let right = n - 1;

        while (left < right) {
          const sum = nums[i] + nums[j] + nums[left] + nums[right];
          if (sum === target) {
            results.push([nums[i], nums[j], nums[left], nums[right]]);
            left += 1;
            right -= 1;
            while (left < right && nums[left] === nums[left - 1]) {
              left += 1;
            }
            while (left < right && nums[right] === nums[right + 1]) {
              right -= 1;
            }
          } else if (sum < target) {
            left += 1;
          } else {
            right -= 1;
          }
        }
      }
    }

    return results;
  }
}
