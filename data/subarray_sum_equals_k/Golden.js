class SubarraySumEqualsK {
  subarraySum(nums, k) {
    if (!nums) {
      return 0;
    }
    const counts = new Map();
    counts.set(0, 1);
    let sum = 0;
    let total = 0;
    for (const num of nums) {
      sum += num;
      const need = sum - k;
      total += counts.get(need) || 0;
      counts.set(sum, (counts.get(sum) || 0) + 1);
    }
    return total;
  }
}
