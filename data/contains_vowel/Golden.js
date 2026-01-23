class ContainsVowel {
  containsVowel(s) {
    for (const ch of s.toLowerCase()) {
      if ("aeiou".includes(ch)) {
        return true;
      }
    }
    return false;
  }
}
