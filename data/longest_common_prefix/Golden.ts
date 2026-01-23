class LongestCommonPrefix {
  longestCommonPrefix(strs) {
    if (!Array.isArray(strs) || strs.length === 0) {
      return "";
    }
    let prefix = strs[0] === null || strs[0] === undefined ? "" : String(strs[0]);
    for (let i = 1; i < strs.length; i++) {
      const current = strs[i] === null || strs[i] === undefined ? "" : String(strs[i]);
      while (prefix.length > 0 && !current.startsWith(prefix)) {
        prefix = prefix.slice(0, -1);
      }
      if (prefix.length === 0) {
        return "";
      }
    }
    return prefix;
  }
}
