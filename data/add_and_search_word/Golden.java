import java.util.ArrayList;
import java.util.List;

class AddAndSearchWord {
    private static class Node {
        Node[] next = new Node[26];
        boolean isWord;
    }

    private void add(Node root, String word) {
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

    private boolean search(Node node, String word, int index) {
        if (node == null) {
            return false;
        }
        if (index == word.length()) {
            return node.isWord;
        }
        char ch = word.charAt(index);
        if (ch == '.') {
            for (int i = 0; i < 26; i += 1) {
                if (node.next[i] != null && search(node.next[i], word, index + 1)) {
                    return true;
                }
            }
            return false;
        }
        int idx = ch - 'a';
        return search(node.next[idx], word, index + 1);
    }

    public int[] wordDictionaryOps(String[] ops, String[] words) {
        Node root = new Node();
        List<Integer> results = new ArrayList<>();
        for (int i = 0; i < ops.length; i += 1) {
            String op = ops[i];
            String arg = words[i];
            if ("add".equals(op)) {
                add(root, arg);
            } else if ("search".equals(op)) {
                results.add(search(root, arg, 0) ? 1 : 0);
            }
        }
        int[] out = new int[results.size()];
        for (int i = 0; i < results.size(); i += 1) {
            out[i] = results.get(i);
        }
        return out;
    }
}
