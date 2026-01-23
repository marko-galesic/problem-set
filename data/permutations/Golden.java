import java.util.*;

class Permutations {
    public int[][] permute(int[] nums) {
        if (nums == null || nums.length == 0) {
            return new int[0][0];
        }

        int[] values = Arrays.copyOf(nums, nums.length);
        Arrays.sort(values);

        List<int[]> results = new ArrayList<>();
        boolean[] used = new boolean[values.length];
        int[] path = new int[values.length];

        backtrack(values, used, path, 0, results);

        int[][] output = new int[results.size()][];
        for (int i = 0; i < results.size(); i++) {
            output[i] = results.get(i);
        }
        return output;
    }

    private void backtrack(int[] values, boolean[] used, int[] path, int depth, List<int[]> results) {
        if (depth == values.length) {
            results.add(Arrays.copyOf(path, path.length));
            return;
        }

        for (int i = 0; i < values.length; i++) {
            if (used[i]) {
                continue;
            }
            used[i] = true;
            path[depth] = values[i];
            backtrack(values, used, path, depth + 1, results);
            used[i] = false;
        }
    }
}
