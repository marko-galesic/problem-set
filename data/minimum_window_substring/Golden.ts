class MinimumWindowSubstring {
  minWindow(s, t) {
    if (!s || !t || t.length === 0 || s.length === 0) {
      return "";
    }
    if (t.length > s.length) {
      return "";
    }

    const need = new Map();
    for (const ch of t) {
      need.set(ch, (need.get(ch) || 0) + 1);
    }

    const window = new Map();
    const required = need.size;
    let formed = 0;
    let left = 0;
    let bestLen = Infinity;
    let bestLeft = 0;

    for (let right = 0; right < s.length; right++) {
      const ch = s[right];
      window.set(ch, (window.get(ch) || 0) + 1);
      if (need.has(ch) && window.get(ch) === need.get(ch)) {
        formed++;
      }

      while (left <= right && formed === required) {
        const windowLen = right - left + 1;
        if (windowLen < bestLen) {
          bestLen = windowLen;
          bestLeft = left;
        }

        const leftChar = s[left];
        window.set(leftChar, window.get(leftChar) - 1);
        if (need.has(leftChar) && window.get(leftChar) < need.get(leftChar)) {
          formed--;
        }
        left++;
      }
    }

    return bestLen === Infinity ? "" : s.slice(bestLeft, bestLeft + bestLen);
  }
}
