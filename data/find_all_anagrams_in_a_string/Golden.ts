class FindAllAnagramsInAString {
  findAnagrams(s, p) {
    if (s.length < p.length) {
      return [];
    }
    const need = new Array(26).fill(0);
    for (const ch of p) {
      need[ch.charCodeAt(0) - 97]++;
    }
    const window = new Array(26).fill(0);
    let required = 0;
    for (const val of need) {
      if (val > 0) {
        required++;
      }
    }
    let matches = 0;
    const result = [];
    let left = 0;
    for (let right = 0; right < s.length; right++) {
      const idx = s.charCodeAt(right) - 97;
      window[idx]++;
      if (window[idx] === need[idx]) {
        matches++;
      }
      if (right - left + 1 > p.length) {
        const leftIdx = s.charCodeAt(left) - 97;
        if (window[leftIdx] === need[leftIdx]) {
          matches--;
        }
        window[leftIdx]--;
        left++;
      }
      if (right - left + 1 === p.length && matches === required) {
        result.push(left);
      }
    }
    return result;
  }
}
