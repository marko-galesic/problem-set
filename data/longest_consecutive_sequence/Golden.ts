class LongestConsecutiveSequence {
  longestConsecutive(nums) {
    if (!nums || nums.length === 0) {
      return 0;
    }
    const set = new Set(nums);
    let best = 0;
    for (const n of set) {
      if (!set.has(n - 1)) {
        let len = 1;
        let cur = n + 1;
        while (set.has(cur)) {
          len++;
          cur++;
        }
        if (len > best) {
          best = len;
        }
      }
    }
    return best;
  }
}
