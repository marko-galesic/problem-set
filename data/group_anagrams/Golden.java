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

        List<List<String>> orderedGroups = new ArrayList<>();
        for (List<String> group : groups.values()) {
            Collections.sort(group);
            orderedGroups.add(group);
        }

        Collections.sort(orderedGroups, (a, b) -> {
            int min = Math.min(a.size(), b.size());
            for (int i = 0; i < min; i++) {
                int cmp = a.get(i).compareTo(b.get(i));
                if (cmp != 0) {
                    return cmp;
                }
            }
            return Integer.compare(a.size(), b.size());
        });

        String[][] result = new String[orderedGroups.size()][];
        for (int i = 0; i < orderedGroups.size(); i++) {
            result[i] = orderedGroups.get(i).toArray(new String[0]);
        }
        return result;
    }
}
