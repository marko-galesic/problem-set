class IsAllDigits {
  isAllDigits(s) {
    if (s.length === 0) return false;
    for (const ch of s) {
      if (ch < '0' || ch > '9') return false;
    }
    return true;
  }
}
