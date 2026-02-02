class CountPalindromicSubstrings {
  countPalindromicSubstrings(s) {
    if (!s) {
      return 0;
    }
    const expand = (l, r) => {
      let count = 0;
      while (l >= 0 && r < s.length && s[l] === s[r]) {
        count++;
        l--;
        r++;
      }
      return count;
    };
    let total = 0;
    for (let i = 0; i < s.length; i++) {
      total += expand(i, i);
      total += expand(i, i + 1);
    }
    return total;
  }
}
