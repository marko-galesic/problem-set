class GroupAnagrams {
  groupAnagrams(strs) {
    if (!Array.isArray(strs) || strs.length === 0) {
      return [];
    }

    const groups = new Map();
    for (const s of strs) {
      const key = s.split("").sort().join("");
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(s);
    }

    return Array.from(groups.values());
  }
}
