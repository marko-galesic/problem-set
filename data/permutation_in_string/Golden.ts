class PermutationInString {
  checkInclusion(s1, s2) {
    if (s1.length > s2.length) return false;
    const need = new Array(26).fill(0);
    const window = new Array(26).fill(0);
    const aCode = 'a'.charCodeAt(0);
    for (const ch of s1) {
      need[ch.charCodeAt(0) - aCode]++;
    }
    for (let i = 0; i < s2.length; i++) {
      const idx = s2.charCodeAt(i) - aCode;
      window[idx]++;
      if (i >= s1.length) {
        const leftIdx = s2.charCodeAt(i - s1.length) - aCode;
        window[leftIdx]--;
      }
      if (i >= s1.length - 1) {
        let match = true;
        for (let j = 0; j < 26; j++) {
          if (need[j] !== window[j]) {
            match = false;
            break;
          }
        }
        if (match) return true;
      }
    }
    return false;
  }
}
