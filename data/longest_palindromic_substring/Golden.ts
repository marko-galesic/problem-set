class LongestPalindromicSubstring {
  longestPalindrome(s) {
    if (s == null || s.length < 2) return s == null ? '' : s;
    let start = 0;
    let end = 0;
    const expand = (left, right) => {
      while (left >= 0 && right < s.length && s[left] === s[right]) {
        left--;
        right++;
      }
      return right - left - 1;
    };
    for (let i = 0; i < s.length; i++) {
      const len1 = expand(i, i);
      const len2 = expand(i, i + 1);
      const len = Math.max(len1, len2);
      if (len > end - start + 1) {
        start = i - Math.floor((len - 1) / 2);
        end = i + Math.floor(len / 2);
      }
    }
    return s.substring(start, end + 1);
  }
}
