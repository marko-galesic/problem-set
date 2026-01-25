class RemoveConsonants {
  removeConsonants(s) {
    let out = '';
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      const lower = c.toLowerCase();
      if (lower >= 'a' && lower <= 'z') {
        if (['a', 'e', 'i', 'o', 'u'].includes(lower)) {
          out += c;
        }
      } else {
        out += c;
      }
    }
    return out;
  }
}
