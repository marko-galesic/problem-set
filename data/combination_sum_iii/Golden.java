import java.util.*;

class CombinationSumIII {
    public int[][] combinationSum3(int k, int n) {
        List<int[]> results = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        backtrack(k, n, 1, current, results);
        int[][] output = new int[results.size()][];
        for (int i = 0; i < results.size(); i++) {
            output[i] = results.get(i);
        }
        return output;
    }

    private void backtrack(int k, int remain, int start, List<Integer> current, List<int[]> results) {
        if (current.size() == k) {
            if (remain == 0) {
                int[] combo = new int[k];
                for (int i = 0; i < k; i++) {
                    combo[i] = current.get(i);
                }
                results.add(combo);
            }
            return;
        }
        for (int num = start; num <= 9; num++) {
            if (num > remain) {
                break;
            }
            current.add(num);
            backtrack(k, remain - num, num + 1, current, results);
            current.remove(current.size() - 1);
        }
    }
}
