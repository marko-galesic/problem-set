import java.util.ArrayList;
import java.util.List;

class StreamOfCharacters {
    private static class Node {
        Node[] next = new Node[26];
        boolean isWord;
    }

    private Node buildTrie(String[] words) {
        Node root = new Node();
        for (String word : words) {
            Node node = root;
            for (int i = word.length() - 1; i >= 0; i -= 1) {
                int idx = word.charAt(i) - 'a';
                if (node.next[idx] == null) {
                    node.next[idx] = new Node();
                }
                node = node.next[idx];
            }
            node.isWord = true;
        }
        return root;
    }

    public int[] streamQueries(String[] words, String[] queries) {
        Node root = buildTrie(words);
        int maxLen = 0;
        for (String word : words) {
            maxLen = Math.max(maxLen, word.length());
        }
        StringBuilder stream = new StringBuilder();
        List<Integer> results = new ArrayList<>();
        for (String q : queries) {
            char ch = q.charAt(0);
            stream.append(ch);
            if (stream.length() > maxLen) {
                stream.delete(0, stream.length() - maxLen);
            }
            Node node = root;
            boolean found = false;
            for (int i = stream.length() - 1; i >= 0; i -= 1) {
                int idx = stream.charAt(i) - 'a';
                node = node.next[idx];
                if (node == null) {
                    break;
                }
                if (node.isWord) {
                    found = true;
                    break;
                }
            }
            results.add(found ? 1 : 0);
        }
        int[] out = new int[results.size()];
        for (int i = 0; i < results.size(); i += 1) {
            out[i] = results.get(i);
        }
        return out;
    }
}
