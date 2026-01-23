class AverageOfArray {
    public double averageOfArray(int[] nums) {
        if (nums.length == 0) return 0.0;
        double sum = 0.0;
        for (int value : nums) {
            sum += value;
        }
        return sum / nums.length;
    }
}
