class GroupShiftedStrings {
  groupShiftedStrings(strings) {
    const groups = new Map();
    const key = (s) => {
      if (s.length === 0) {
        return '';
      }
      const base = s.charCodeAt(0);
      const diffs = [];
      for (let i = 0; i < s.length; i++) {
        const diff = (s.charCodeAt(i) - base + 26) % 26;
        diffs.push(diff);
      }
      return diffs.join('#');
    };
    for (const s of strings) {
      const k = key(s);
      if (!groups.has(k)) {
        groups.set(k, []);
      }
      groups.get(k).push(s);
    }
    const result = Array.from(groups.values());
    for (const group of result) {
      group.sort();
    }
    result.sort((a, b) => {
      const firstA = a.length ? a[0] : '';
      const firstB = b.length ? b[0] : '';
      return firstA.localeCompare(firstB);
    });
    return result;
  }
}
