class ReverseWordsInString {
  reverseWordsInString(s) {
    if (s.length === 0) return s;
    const parts = s.split(" ");
    parts.reverse();
    return parts.join(" ");
  }
}
