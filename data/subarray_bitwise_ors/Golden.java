import java.util.*;

class SubarrayBitwiseOrs {
    public int subarrayBitwiseORs(int[] arr) {
        Set<Integer> result = new HashSet<>();
        Set<Integer> prev = new HashSet<>();
        for (int n : arr) {
            Set<Integer> cur = new HashSet<>();
            cur.add(n);
            for (int v : prev) {
                cur.add(v | n);
            }
            result.addAll(cur);
            prev = cur;
        }
        return result.size();
    }
}
