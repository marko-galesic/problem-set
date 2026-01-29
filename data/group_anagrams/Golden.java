import java.util.*;

class GroupAnagrams {
    public String[][] groupAnagrams(String[] strs) {
        if (strs == null || strs.length == 0) {
            return new String[0][0];
        }

        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }

        String[][] result = new String[groups.size()][];
        int idx = 0;
        for (List<String> group : groups.values()) {
            result[idx++] = group.toArray(new String[0]);
        }
        return result;
    }
}
