class CountWords {
  countWords(s) {
    const trimmed = s.trim();
    if (trimmed.length === 0) return 0;
    return trimmed.split(/\s+/).length;
  }
}
