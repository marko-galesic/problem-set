class OneEditDistance {
  oneEditDistance(s, t) {
    if (s === t) {
      return false;
    }
    if (s.length > t.length) {
      const tmp = s;
      s = t;
      t = tmp;
    }
    if (t.length - s.length > 1) {
      return false;
    }
    let i = 0;
    let j = 0;
    let diff = 0;
    while (i < s.length && j < t.length) {
      if (s[i] === t[j]) {
        i++;
        j++;
      } else {
        diff++;
        if (diff > 1) {
          return false;
        }
        if (s.length === t.length) {
          i++;
          j++;
        } else {
          j++;
        }
      }
    }
    return true;
  }
}
