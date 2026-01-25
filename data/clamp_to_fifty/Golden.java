class ClampToFifty {
    public int clampToFifty(int n) {
        return Math.max(-50, Math.min(n, 50));
    }
}
