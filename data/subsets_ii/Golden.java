import java.util.*;

class SubsetsII {
    public int[][] subsetsWithDup(int[] nums) {
        if (nums == null) {
            return new int[0][0];
        }

        Arrays.sort(nums);
        List<int[]> results = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        backtrack(nums, 0, current, results);

        return results.toArray(new int[results.size()][]);
    }

    private void backtrack(int[] nums, int start, List<Integer> current, List<int[]> results) {
        results.add(toArray(current));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) {
                continue;
            }
            current.add(nums[i]);
            backtrack(nums, i + 1, current, results);
            current.remove(current.size() - 1);
        }
    }

    private int[] toArray(List<Integer> current) {
        int[] arr = new int[current.size()];
        for (int i = 0; i < current.size(); i++) {
            arr[i] = current.get(i);
        }
        return arr;
    }
}
