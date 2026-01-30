import java.util.*;

class MergeKSortedLists {
    public int[] mergeKSortedLists(int[][] lists) {
        if (lists == null) {
            return new int[0];
        }
        List<Integer> values = new ArrayList<>();
        for (int[] list : lists) {
            if (list == null) continue;
            for (int val : list) {
                values.add(val);
            }
        }
        Collections.sort(values);
        int[] result = new int[values.size()];
        for (int i = 0; i < values.size(); i++) {
            result[i] = values.get(i);
        }
        return result;
    }
}
