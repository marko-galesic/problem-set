import java.util.*;

class Subsets {
    public int[][] subsets(int[] nums) {
        if (nums == null) {
            return new int[0][0];
        }

        Arrays.sort(nums);
        List<int[]> results = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        backtrack(0, nums, path, results);

        int[][] output = new int[results.size()][];
        for (int i = 0; i < results.size(); i++) {
            output[i] = results.get(i);
        }
        return output;
    }

    private void backtrack(int start, int[] nums, List<Integer> path, List<int[]> results) {
        int[] snapshot = new int[path.size()];
        for (int i = 0; i < path.size(); i++) {
            snapshot[i] = path.get(i);
        }
        results.add(snapshot);

        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(i + 1, nums, path, results);
            path.remove(path.size() - 1);
        }
    }
}
