class FirstIndexOfChar {
  firstIndexOfChar(s, c) {
    if (c.length === 0) return -1;
    return s.indexOf(c[0]);
  }
}
