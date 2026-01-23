class CountOccurrencesOfChar {
  countOccurrencesOfChar(s, c) {
    if (c.length === 0) return 0;
    let count = 0;
    const target = c[0];
    for (const ch of s) {
      if (ch === target) count++;
    }
    return count;
  }
}
