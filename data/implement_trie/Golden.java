import java.util.ArrayList;
import java.util.List;

class ImplementTrie {
    private static class Node {
        Node[] next = new Node[26];
        boolean isWord;
    }

    private void insert(Node root, String word) {
        Node node = root;
        for (int i = 0; i < word.length(); i += 1) {
            int idx = word.charAt(i) - 'a';
            if (node.next[idx] == null) {
                node.next[idx] = new Node();
            }
            node = node.next[idx];
        }
        node.isWord = true;
    }

    private boolean search(Node root, String word) {
        Node node = root;
        for (int i = 0; i < word.length(); i += 1) {
            int idx = word.charAt(i) - 'a';
            if (node.next[idx] == null) {
                return false;
            }
            node = node.next[idx];
        }
        return node.isWord;
    }

    private boolean startsWith(Node root, String prefix) {
        Node node = root;
        for (int i = 0; i < prefix.length(); i += 1) {
            int idx = prefix.charAt(i) - 'a';
            if (node.next[idx] == null) {
                return false;
            }
            node = node.next[idx];
        }
        return true;
    }

    public int[] trieOps(String[] ops, String[] words) {
        Node root = new Node();
        List<Integer> results = new ArrayList<>();
        for (int i = 0; i < ops.length; i += 1) {
            String op = ops[i];
            String arg = words[i];
            if ("insert".equals(op)) {
                insert(root, arg);
            } else if ("search".equals(op)) {
                results.add(search(root, arg) ? 1 : 0);
            } else if ("startsWith".equals(op)) {
                results.add(startsWith(root, arg) ? 1 : 0);
            }
        }
        int[] out = new int[results.size()];
        for (int i = 0; i < results.size(); i += 1) {
            out[i] = results.get(i);
        }
        return out;
    }
}
