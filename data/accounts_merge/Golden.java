import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class AccountsMerge {
    private static class DSU {
        int[] parent;
        int[] rank;

        DSU(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i += 1) {
                parent[i] = i;
            }
        }

        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        void union(int a, int b) {
            int ra = find(a);
            int rb = find(b);
            if (ra == rb) {
                return;
            }
            if (rank[ra] < rank[rb]) {
                parent[ra] = rb;
            } else if (rank[ra] > rank[rb]) {
                parent[rb] = ra;
            } else {
                parent[rb] = ra;
                rank[ra] += 1;
            }
        }
    }

    public String[][] accountsMerge(String[] accounts) {
        Map<String, Integer> emailId = new HashMap<>();
        Map<String, String> emailName = new HashMap<>();
        List<String[]> parsed = new ArrayList<>();

        for (String account : accounts) {
            String[] tokens = account.split(",");
            if (tokens.length == 0) {
                continue;
            }
            String name = tokens[0];
            String[] emails = Arrays.copyOfRange(tokens, 1, tokens.length);
            parsed.add(emails);
            for (String email : emails) {
                if (!emailId.containsKey(email)) {
                    emailId.put(email, emailId.size());
                }
                emailName.put(email, name);
            }
        }

        DSU dsu = new DSU(emailId.size());
        int index = 0;
        for (String[] emails : parsed) {
            if (emails.length == 0) {
                index += 1;
                continue;
            }
            int firstId = emailId.get(emails[0]);
            for (int i = 1; i < emails.length; i += 1) {
                dsu.union(firstId, emailId.get(emails[i]));
            }
            index += 1;
        }

        Map<Integer, List<String>> groups = new HashMap<>();
        for (Map.Entry<String, Integer> entry : emailId.entrySet()) {
            String email = entry.getKey();
            int root = dsu.find(entry.getValue());
            groups.computeIfAbsent(root, k -> new ArrayList<>()).add(email);
        }

        List<String[]> merged = new ArrayList<>();
        for (List<String> emails : groups.values()) {
            Collections.sort(emails);
            String name = emailName.get(emails.get(0));
            String[] row = new String[emails.size() + 1];
            row[0] = name;
            for (int i = 0; i < emails.size(); i += 1) {
                row[i + 1] = emails.get(i);
            }
            merged.add(row);
        }

        merged.sort(new Comparator<String[]>() {
            @Override
            public int compare(String[] a, String[] b) {
                int cmp = a[0].compareTo(b[0]);
                if (cmp != 0) {
                    return cmp;
                }
                String aEmail = a.length > 1 ? a[1] : "";
                String bEmail = b.length > 1 ? b[1] : "";
                return aEmail.compareTo(bEmail);
            }
        });

        return merged.toArray(new String[0][]);
    }
}
