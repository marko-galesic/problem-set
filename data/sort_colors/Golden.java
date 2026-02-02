class SortColors {
    public int[] sortColors(int[] nums) {
        if (nums == null) {
            return new int[0];
        }
        int count0 = 0;
        int count1 = 0;
        int count2 = 0;
        for (int num : nums) {
            if (num == 0) {
                count0++;
            } else if (num == 1) {
                count1++;
            } else {
                count2++;
            }
        }
        int[] result = new int[nums.length];
        int index = 0;
        for (int i = 0; i < count0; i++) {
            result[index++] = 0;
        }
        for (int i = 0; i < count1; i++) {
            result[index++] = 1;
        }
        for (int i = 0; i < count2; i++) {
            result[index++] = 2;
        }
        return result;
    }
}
