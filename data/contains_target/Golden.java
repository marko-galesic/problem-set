class ContainsTarget {
    public boolean containsTarget(int[] nums, int target) {
        for (int value : nums) {
            if (value == target) return true;
        }
        return false;
    }
}
