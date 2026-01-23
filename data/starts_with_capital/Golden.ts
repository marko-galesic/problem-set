class StartsWithCapital {
  startsWithCapital(s) {
    if (s.length === 0) return false;
    const ch = s[0];
    return ch >= 'A' && ch <= 'Z';
  }
}
