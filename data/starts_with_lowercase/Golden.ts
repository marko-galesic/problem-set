class StartsWithLowercase {
  startsWithLowercase(s) {
    if (!s || s.length === 0) {
      return false;
    }
    return /[a-z]/.test(s[0]);
  }
}
