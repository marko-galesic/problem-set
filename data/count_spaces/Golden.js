class CountSpaces {
  countSpaces(s) {
    let count = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === ' ') {
        count++;
      }
    }
    return count;
  }
}
