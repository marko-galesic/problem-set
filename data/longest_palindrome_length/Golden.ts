class LongestPalindromeLength {
  longestPalindromeLength(s) {
    if (!s) {
      return 0;
    }
    const counts = new Map();
    for (const ch of s) {
      counts.set(ch, (counts.get(ch) || 0) + 1);
    }
    let length = 0;
    let odd = false;
    for (const count of counts.values()) {
      length += Math.floor(count / 2) * 2;
      if (count % 2 === 1) {
        odd = true;
      }
    }
    return length + (odd ? 1 : 0);
  }
}
