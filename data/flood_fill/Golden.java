class FloodFill {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        if (image == null || image.length == 0 || image[0].length == 0) {
            return image;
        }
        int original = image[sr][sc];
        if (original == color) {
            return image;
        }
        int rows = image.length;
        int cols = image[0].length;
        java.util.ArrayDeque<int[]> stack = new java.util.ArrayDeque<>();
        stack.push(new int[] { sr, sc });
        image[sr][sc] = color;
        int[][] dirs = { {1, 0}, {-1, 0}, {0, 1}, {0, -1} };
        while (!stack.isEmpty()) {
            int[] cell = stack.pop();
            for (int[] dir : dirs) {
                int r = cell[0] + dir[0];
                int c = cell[1] + dir[1];
                if (r >= 0 && r < rows && c >= 0 && c < cols && image[r][c] == original) {
                    image[r][c] = color;
                    stack.push(new int[] { r, c });
                }
            }
        }
        return image;
    }
}
