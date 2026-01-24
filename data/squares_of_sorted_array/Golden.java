class SquaresOfSortedArray {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        int left = 0;
        int right = n - 1;
        int write = n - 1;
        while (left <= right) {
            int leftVal = nums[left];
            int rightVal = nums[right];
            int leftSq = leftVal * leftVal;
            int rightSq = rightVal * rightVal;
            if (leftSq > rightSq) {
                result[write--] = leftSq;
                left++;
            } else {
                result[write--] = rightSq;
                right--;
            }
        }
        return result;
    }
}
