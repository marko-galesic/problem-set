class ReorganizeString {
  reorganizeString(s) {
    const freq = new Map();
    for (const ch of s) {
      freq.set(ch, (freq.get(ch) || 0) + 1);
    }
    const chars = Array.from(freq.keys()).sort();
    let result = '';
    let prev = null;
    const n = s.length;
    for (let pos = 0; pos < n; pos++) {
      let placed = false;
      for (const ch of chars) {
        const count = freq.get(ch) || 0;
        if (count === 0 || ch === prev) {
          continue;
        }
        freq.set(ch, count - 1);
        const remaining = n - pos - 1;
        let maxCount = 0;
        for (const c of chars) {
          const value = freq.get(c) || 0;
          if (value > maxCount) {
            maxCount = value;
          }
        }
        if (maxCount <= Math.floor((remaining + 1) / 2)) {
          result += ch;
          prev = ch;
          placed = true;
          break;
        }
        freq.set(ch, count);
      }
      if (!placed) {
        return "";
      }
    }
    return result;
  }
}
