class LastIndexOfChar {
  lastIndexOfChar(s, c) {
    if (c.length === 0) return -1;
    return s.lastIndexOf(c[0]);
  }
}
