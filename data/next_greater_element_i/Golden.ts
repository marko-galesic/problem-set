class NextGreaterElementI {
  nextGreaterElement(nums1, nums2) {
    const next = new Map();
    const stack = [];
    for (const num of nums2) {
      while (stack.length && num > stack[stack.length - 1]) {
        next.set(stack.pop(), num);
      }
      stack.push(num);
    }
    while (stack.length) {
      next.set(stack.pop(), -1);
    }
    return nums1.map((num) => next.has(num) ? next.get(num) : -1);
  }
}
