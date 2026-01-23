class FirstUniqueCharacter {
  firstUniqChar(s) {
    if (s === null || s === undefined || s.length === 0) {
      return -1;
    }

    const counts = new Map();
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      counts.set(ch, (counts.get(ch) || 0) + 1);
    }

    for (let i = 0; i < s.length; i++) {
      if (counts.get(s[i]) === 1) {
        return i;
      }
    }

    return -1;
  }
}
