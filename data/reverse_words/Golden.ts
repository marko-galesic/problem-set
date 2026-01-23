class ReverseWords {
  reverseWords(s) {
    const trimmed = s.trim();
    if (!trimmed) {
      return "";
    }
    const words = trimmed.split(/\s+/);
    words.reverse();
    return words.join(" ");
  }
}
