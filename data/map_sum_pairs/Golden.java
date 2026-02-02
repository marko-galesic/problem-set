import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class MapSumPairs {
    private static class Node {
        Node[] next = new Node[26];
        int sum;
    }

    private void insert(Node root, Map<String, Integer> values, String key, int val) {
        int delta = val - values.getOrDefault(key, 0);
        values.put(key, val);
        Node node = root;
        node.sum += delta;
        for (int i = 0; i < key.length(); i += 1) {
            int idx = key.charAt(i) - 'a';
            if (node.next[idx] == null) {
                node.next[idx] = new Node();
            }
            node = node.next[idx];
            node.sum += delta;
        }
    }

    private int sum(Node root, String prefix) {
        Node node = root;
        for (int i = 0; i < prefix.length(); i += 1) {
            int idx = prefix.charAt(i) - 'a';
            if (node.next[idx] == null) {
                return 0;
            }
            node = node.next[idx];
        }
        return node.sum;
    }

    public int[] mapSumOps(String[] ops, String[] keys, int[] vals) {
        Node root = new Node();
        Map<String, Integer> values = new HashMap<>();
        List<Integer> results = new ArrayList<>();
        for (int i = 0; i < ops.length; i += 1) {
            String op = ops[i];
            if ("insert".equals(op)) {
                insert(root, values, keys[i], vals[i]);
            } else if ("sum".equals(op)) {
                results.add(sum(root, keys[i]));
            }
        }
        int[] out = new int[results.size()];
        for (int i = 0; i < results.size(); i += 1) {
            out[i] = results.get(i);
        }
        return out;
    }
}
