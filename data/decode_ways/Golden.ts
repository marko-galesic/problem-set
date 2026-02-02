class DecodeWays {
  numDecodings(s) {
    if (!s || s.length === 0) {
      return 0;
    }
    let prev2 = 1;
    let prev1 = s[0] !== '0' ? 1 : 0;
    for (let i = 1; i < s.length; i++) {
      let current = 0;
      if (s[i] !== '0') {
        current += prev1;
      }
      const two = (s.charCodeAt(i - 1) - 48) * 10 + (s.charCodeAt(i) - 48);
      if (two >= 10 && two <= 26) {
        current += prev2;
      }
      prev2 = prev1;
      prev1 = current;
    }
    return prev1;
  }
}
