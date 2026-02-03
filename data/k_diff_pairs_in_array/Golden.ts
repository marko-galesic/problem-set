class KDiffPairsInArray {
  findPairs(nums, k) {
    if (k < 0) {
      return 0;
    }
    const freq = new Map();
    for (const n of nums) {
      freq.set(n, (freq.get(n) || 0) + 1);
    }
    if (k === 0) {
      let count = 0;
      for (const v of freq.values()) {
        if (v > 1) {
          count++;
        }
      }
      return count;
    }
    let count = 0;
    for (const n of freq.keys()) {
      if (freq.has(n + k)) {
        count++;
      }
    }
    return count;
  }
}
