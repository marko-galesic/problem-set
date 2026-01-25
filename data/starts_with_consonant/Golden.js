class StartsWithConsonant {
  startsWithConsonant(s) {
    if (!s || s.length === 0) {
      return false;
    }
    const c = s[0];
    if (!/[a-zA-Z]/.test(c)) {
      return false;
    }
    const lower = c.toLowerCase();
    return !['a', 'e', 'i', 'o', 'u'].includes(lower);
  }
}
