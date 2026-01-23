class SwapFirstLastChar {
  swapFirstLastChar(s) {
    if (s.length <= 1) return s;
    return s[s.length - 1] + s.slice(1, -1) + s[0];
  }
}
