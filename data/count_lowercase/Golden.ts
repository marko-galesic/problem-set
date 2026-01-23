class CountLowercase {
  countLowercase(s) {
    let count = 0;
    for (const ch of s) {
      if (ch >= "a" && ch <= "z") {
        count++;
      }
    }
    return count;
  }
}
