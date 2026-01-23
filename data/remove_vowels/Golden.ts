class RemoveVowels {
  removeVowels(s) {
    let result = "";
    for (const ch of s) {
      const lower = ch.toLowerCase();
      if (!"aeiou".includes(lower)) {
        result += ch;
      }
    }
    return result;
  }
}
