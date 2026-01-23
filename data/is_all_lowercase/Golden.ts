class IsAllLowercase {
  isAllLowercase(s) {
    let hasLetter = false;
    for (const ch of s) {
      const lower = ch.toLowerCase();
      if (lower >= "a" && lower <= "z") {
        hasLetter = true;
        if (ch !== ch.toLowerCase()) {
          return false;
        }
      }
    }
    return hasLetter;
  }
}
