class ContiguousArray {
  findMaxLength(nums) {
    if (!nums) {
      return 0;
    }
    const firstIndex = new Map();
    firstIndex.set(0, -1);
    let sum = 0;
    let best = 0;
    for (let i = 0; i < nums.length; i++) {
      sum += nums[i] === 1 ? 1 : -1;
      if (firstIndex.has(sum)) {
        best = Math.max(best, i - firstIndex.get(sum));
      } else {
        firstIndex.set(sum, i);
      }
    }
    return best;
  }
}
