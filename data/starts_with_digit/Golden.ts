class StartsWithDigit {
  startsWithDigit(s) {
    if (!s || s.length === 0) {
      return false;
    }
    return /[0-9]/.test(s[0]);
  }
}
