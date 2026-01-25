class CountDigitsInString {
  countDigitsInString(s) {
    let count = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c >= '0' && c <= '9') {
        count++;
      }
    }
    return count;
  }
}
