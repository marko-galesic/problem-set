class LongestSubstringWithoutRepeatingCharacters {
  lengthOfLongestSubstring(s) {
    let left = 0;
    let maxLen = 0;
    const indexMap = new Map();
    for (let right = 0; right < s.length; right++) {
      const ch = s[right];
      if (indexMap.has(ch) && indexMap.get(ch) >= left) {
        left = indexMap.get(ch) + 1;
      }
      indexMap.set(ch, right);
      maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
  }
}
