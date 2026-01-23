import java.util.*;

class CombinationSumII {
    public int[][] combinationSum2(int[] candidates, int target) {
        if (candidates == null || candidates.length == 0) {
            return new int[0][0];
        }

        Arrays.sort(candidates);
        List<int[]> results = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        backtrack(candidates, target, 0, current, results);

        int[][] output = new int[results.size()][];
        for (int i = 0; i < results.size(); i++) {
            output[i] = results.get(i);
        }
        return output;
    }

    private void backtrack(int[] candidates, int remaining, int start, List<Integer> current, List<int[]> results) {
        if (remaining == 0) {
            int[] combo = new int[current.size()];
            for (int i = 0; i < current.size(); i++) {
                combo[i] = current.get(i);
            }
            results.add(combo);
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            if (i > start && candidates[i] == candidates[i - 1]) {
                continue;
            }
            int value = candidates[i];
            if (value > remaining) {
                break;
            }
            current.add(value);
            backtrack(candidates, remaining - value, i + 1, current, results);
            current.remove(current.size() - 1);
        }
    }
}
