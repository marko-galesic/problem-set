class MoveZeroes {
    public int[] moveZeroes(int[] nums) {
        if (nums == null) {
            return null;
        }

        int[] result = new int[nums.length];
        int index = 0;
        for (int num : nums) {
            if (num != 0) {
                result[index++] = num;
            }
        }
        return result;
    }
}
