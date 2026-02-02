class ShortestUnsortedContinuousSubarray {
  findUnsortedSubarray(nums) {
    const n = nums.length;
    let left = n;
    let right = 0;
    const stack = [];

    for (let i = 0; i < n; i++) {
      while (stack.length && nums[stack[stack.length - 1]] > nums[i]) {
        left = Math.min(left, stack.pop());
      }
      stack.push(i);
    }

    stack.length = 0;
    for (let i = n - 1; i >= 0; i--) {
      while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
        right = Math.max(right, stack.pop());
      }
      stack.push(i);
    }

    if (right <= left) {
      return 0;
    }
    return right - left + 1;
  }
}
