class StringRunLengthEncode {
  stringRunLengthEncode(s) {
    if (!s) {
      return '';
    }
    let result = '';
    let count = 1;
    for (let i = 1; i < s.length; i++) {
      if (s[i] === s[i - 1]) {
        count++;
      } else {
        result += s[i - 1] + String(count);
        count = 1;
      }
    }
    result += s[s.length - 1] + String(count);
    return result;
  }
}
