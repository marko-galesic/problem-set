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

    const result = Array.from(groups.values());
    for (const group of result) {
      group.sort();
    }
    result.sort(compareGroups);
    return result;
  }
}

function compareGroups(a, b) {
  const minLength = Math.min(a.length, b.length);
  for (let i = 0; i < minLength; i++) {
    if (a[i] < b[i]) {
      return -1;
    }
    if (a[i] > b[i]) {
      return 1;
    }
  }
  return a.length - b.length;
}
