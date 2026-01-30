class RotateStringK {
  rotateStringK(s, k) {
    if (s.length === 0) {
      return s;
    }
    const n = s.length;
    const shift = k % n;
    if (shift === 0) {
      return s;
    }
    return s.slice(n - shift) + s.slice(0, n - shift);
  }
}
