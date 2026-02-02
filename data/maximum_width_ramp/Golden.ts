class MaximumWidthRamp {
  maxWidthRamp(nums) {
    const n = nums.length;
    const stack = [];
    for (let i = 0; i < n; i++) {
      if (!stack.length || nums[i] < nums[stack[stack.length - 1]]) {
        stack.push(i);
      }
    }
    let maxWidth = 0;
    for (let j = n - 1; j >= 0; j--) {
      while (stack.length && nums[j] >= nums[stack[stack.length - 1]]) {
        maxWidth = Math.max(maxWidth, j - stack.pop());
      }
    }
    return maxWidth;
  }
}
