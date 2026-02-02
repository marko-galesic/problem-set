import java.util.StringJoiner;

class ReplaceWords {
    private static class Node {
        Node[] next = new Node[26];
        boolean isWord;
    }

    private Node buildTrie(String[] dictionary) {
        Node root = new Node();
        for (String word : dictionary) {
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
        return root;
    }

    private String replaceWord(Node root, String word) {
        Node node = root;
        StringBuilder prefix = new StringBuilder();
        for (int i = 0; i < word.length(); i += 1) {
            int idx = word.charAt(i) - 'a';
            if (node.next[idx] == null) {
                return word;
            }
            node = node.next[idx];
            prefix.append(word.charAt(i));
            if (node.isWord) {
                return prefix.toString();
            }
        }
        return word;
    }

    public String replaceWords(String[] dictionary, String sentence) {
        Node root = buildTrie(dictionary);
        String[] parts = sentence.split(" ");
        StringJoiner joiner = new StringJoiner(" ");
        for (String part : parts) {
            joiner.add(replaceWord(root, part));
        }
        return joiner.toString();
    }
}
