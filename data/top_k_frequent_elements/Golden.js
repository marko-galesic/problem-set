class TopKFrequentElements {
  topKFrequent(nums, k) {
    const freq = new Map();
    for (const n of nums) {
      freq.set(n, (freq.get(n) || 0) + 1);
    }
    const sorted = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, k).map(([num]) => num);
  }
}
