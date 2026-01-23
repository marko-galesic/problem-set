class StartsWithVowel {
  startsWithVowel(s) {
    if (!s) {
      return false;
    }
    const first = s[0].toLowerCase();
    return "aeiou".includes(first);
  }
}
