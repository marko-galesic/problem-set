class CountConsonants {
  countConsonants(s) {
    let count = 0;
    for (const ch of s) {
      const lower = ch.toLowerCase();
      if (lower >= "a" && lower <= "z" && !"aeiou".includes(lower)) {
        count++;
      }
    }
    return count;
  }
}
