class LongestRepeatingCharacterReplacement {
  characterReplacement(s, k) {
    const counts = new Map();
    let left = 0;
    let maxCount = 0;
    let maxLen = 0;
    for (let right = 0; right < s.length; right++) {
      const ch = s[right];
      counts.set(ch, (counts.get(ch) || 0) + 1);
      maxCount = Math.max(maxCount, counts.get(ch));
      while (right - left + 1 - maxCount > k) {
        const leftCh = s[left];
        counts.set(leftCh, counts.get(leftCh) - 1);
        left++;
      }
      maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
  }
}
