class DecodeString {
  decodeString(s) {
    if (s === null || s === undefined) {
      return '';
    }
    const counts = [];
    const builders = [];
    let current = [];
    let number = 0;
    for (const ch of s) {
      if (ch >= '0' && ch <= '9') {
        number = number * 10 + (ch.charCodeAt(0) - 48);
      } else if (ch === '[') {
        counts.push(number);
        builders.push(current);
        current = [];
        number = 0;
      } else if (ch === ']') {
        const repeat = counts.pop();
        const prev = builders.pop();
        for (let i = 0; i < repeat; i++) {
          prev.push(...current);
        }
        current = prev;
      } else {
        current.push(ch);
      }
    }
    return current.join('');
  }
}
