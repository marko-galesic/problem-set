class ToggleCase {
  toggleCase(s) {
    const upperRegex = /\p{Lu}/u;
    const lowerRegex = /\p{Ll}/u;
    let result = "";
    for (const ch of s) {
      if (upperRegex.test(ch)) {
        result += ch.toLowerCase();
      } else if (lowerRegex.test(ch)) {
        result += ch.toUpperCase();
      } else {
        result += ch;
      }
    }
    return result;
  }
}
