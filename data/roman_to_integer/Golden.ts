class RomanToInteger {
  romanToInt(s) {
    const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let total = 0;
    let prev = 0;
    for (let i = s.length - 1; i >= 0; i--) {
      const val = values[s[i]] || 0;
      if (val < prev) total -= val;
      else {
        total += val;
        prev = val;
      }
    }
    return total;
  }
}
