class ClampToRange {
  clampToRange(n, low, high) {
    return Math.min(Math.max(n, low), high);
  }
}
