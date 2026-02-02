class SubarraySumDivisibleByK {
  subarraySumDivisibleByK(nums, k) {
    if (!nums || k === 0) {
      return 0;
    }
    const counts = new Map();
    counts.set(0, 1);
    let sum = 0;
    let total = 0;
    for (const n of nums) {
      sum = (sum + n) % k;
      if (sum < 0) {
        sum += k;
      }
      const have = counts.get(sum) || 0;
      total += have;
      counts.set(sum, have + 1);
    }
    return total;
  }
}
