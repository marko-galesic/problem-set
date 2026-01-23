class SlidingWindowMaximum {
  maxSlidingWindow(nums, k) {
    if (!Array.isArray(nums) || nums.length === 0 || k <= 0 || k > nums.length) {
      return [];
    }
    const result = new Array(nums.length - k + 1);
    const deque = [];
    let head = 0;
    for (let i = 0; i < nums.length; i++) {
      if (head < deque.length && deque[head] <= i - k) {
        head += 1;
      }
      while (head < deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
        deque.pop();
      }
      deque.push(i);
      if (i >= k - 1) {
        result[i - k + 1] = nums[deque[head]];
      }
    }
    return result;
  }
}
