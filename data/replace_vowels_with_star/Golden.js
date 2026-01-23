class ReplaceVowelsWithStar {
  replaceVowelsWithStar(s) {
    let result = "";
    for (const ch of s) {
      const lower = ch.toLowerCase();
      if ("aeiou".includes(lower)) {
        result += "*";
      } else {
        result += ch;
      }
    }
    return result;
  }
}
