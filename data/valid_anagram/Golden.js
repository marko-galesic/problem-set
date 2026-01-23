class ValidAnagram {
  isAnagram(s, t) {
    if (s === null || s === undefined || t === null || t === undefined) {
      return s === t;
    }
    if (s.length !== t.length) {
      return false;
    }
    const left = s.split('').sort();
    const right = t.split('').sort();
    for (let i = 0; i < left.length; i++) {
      if (left[i] !== right[i]) {
        return false;
      }
    }
    return true;
  }
}
