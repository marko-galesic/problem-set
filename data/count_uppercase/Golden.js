class CountUppercase {
  countUppercase(s) {
    let count = 0;
    for (const ch of s) {
      if (ch >= "A" && ch <= "Z") {
        count++;
      }
    }
    return count;
  }
}
