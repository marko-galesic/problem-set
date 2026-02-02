class LongestSubstringKDistinct {
  longestSubstringKDistinct(s, k) {
    if (!s || k <= 0) {
      return 0;
    }
    const counts = new Map();
    let left = 0;
    let best = 0;
    for (let right = 0; right < s.length; right++) {
      const ch = s[right];
      counts.set(ch, (counts.get(ch) || 0) + 1);
      while (counts.size > k) {
        const c = s[left];
        const next = counts.get(c) - 1;
        if (next === 0) {
          counts.delete(c);
        } else {
          counts.set(c, next);
        }
        left++;
      }
      best = Math.max(best, right - left + 1);
    }
    return best;
  }
}
