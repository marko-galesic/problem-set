class ContainerWithMostWater {
    public int maxArea(int[] height) {
        if (height == null || height.length < 2) {
            return 0;
        }
        int left = 0;
        int right = height.length - 1;
        int best = 0;
        while (left < right) {
            int leftHeight = height[left];
            int rightHeight = height[right];
            int minHeight = Math.min(leftHeight, rightHeight);
            int area = minHeight * (right - left);
            if (area > best) {
                best = area;
            }
            if (leftHeight <= rightHeight) {
                left++;
            } else {
                right--;
            }
        }
        return best;
    }
}
