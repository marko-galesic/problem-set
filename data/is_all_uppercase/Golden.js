class IsAllUppercase {
  isAllUppercase(s) {
    let hasLetter = false;
    for (const ch of s) {
      const lower = ch.toLowerCase();
      if (lower >= "a" && lower <= "z") {
        hasLetter = true;
        if (ch !== ch.toUpperCase()) {
          return false;
        }
      }
    }
    return hasLetter;
  }
}
