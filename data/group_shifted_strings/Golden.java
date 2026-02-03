import java.util.*;

class GroupShiftedStrings {
    public String[][] groupShiftedStrings(String[] strings) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strings) {
            String key;
            if (s.isEmpty()) {
                key = "";
            } else {
                StringBuilder sb = new StringBuilder();
                int base = s.charAt(0);
                for (int i = 0; i < s.length(); i++) {
                    int diff = (s.charAt(i) - base + 26) % 26;
                    if (i > 0) {
                        sb.append('#');
                    }
                    sb.append(diff);
                }
                key = sb.toString();
            }
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        List<List<String>> result = new ArrayList<>(groups.values());
        for (List<String> group : result) {
            Collections.sort(group);
        }
        result.sort(Comparator.comparing(list -> list.get(0)));
        String[][] output = new String[result.size()][];
        for (int i = 0; i < result.size(); i++) {
            output[i] = result.get(i).toArray(new String[0]);
        }
        return output;
    }
}
