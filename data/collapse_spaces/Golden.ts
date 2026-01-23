class CollapseSpaces {
  collapseSpaces(s) {
    const trimmed = s.trim();
    if (!trimmed) {
      return "";
    }
    return trimmed.replace(/\s+/g, " ");
  }
}
