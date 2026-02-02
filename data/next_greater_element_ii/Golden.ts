class NextGreaterElementII {
  nextGreaterElements(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = [];
    for (let i = 0; i < 2 * n; i++) {
      const idx = i % n;
      while (stack.length && nums[idx] > nums[stack[stack.length - 1]]) {
        result[stack.pop()] = nums[idx];
      }
      if (i < n) {
        stack.push(idx);
      }
    }
    return result;
  }
}
