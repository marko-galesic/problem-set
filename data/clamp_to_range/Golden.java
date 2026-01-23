class ClampToRange {
    public int clampToRange(int n, int low, int high) {
        return Math.min(Math.max(n, low), high);
    }
}
