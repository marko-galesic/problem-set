import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class WordSearchII {
    private static class Node {
        Node[] next = new Node[26];
        String word;
    }

    private Node buildTrie(String[] words) {
        Node root = new Node();
        for (String word : words) {
            Node node = root;
            for (int i = 0; i < word.length(); i += 1) {
                int idx = word.charAt(i) - 'a';
                if (node.next[idx] == null) {
                    node.next[idx] = new Node();
                }
                node = node.next[idx];
            }
            node.word = word;
        }
        return root;
    }

    private void dfs(char[][] board, int r, int c, Node node, List<String> results) {
        char ch = board[r][c];
        if (ch == '#') {
            return;
        }
        int idx = ch - 'a';
        Node nextNode = node.next[idx];
        if (nextNode == null) {
            return;
        }
        if (nextNode.word != null) {
            results.add(nextNode.word);
            nextNode.word = null;
        }
        board[r][c] = '#';
        if (r > 0) {
            dfs(board, r - 1, c, nextNode, results);
        }
        if (c > 0) {
            dfs(board, r, c - 1, nextNode, results);
        }
        if (r + 1 < board.length) {
            dfs(board, r + 1, c, nextNode, results);
        }
        if (c + 1 < board[0].length) {
            dfs(board, r, c + 1, nextNode, results);
        }
        board[r][c] = ch;
    }

    public String[] findWords(char[][] board, String[] words) {
        Node root = buildTrie(words);
        List<String> results = new ArrayList<>();
        for (int r = 0; r < board.length; r += 1) {
            for (int c = 0; c < board[0].length; c += 1) {
                dfs(board, r, c, root, results);
            }
        }
        Collections.sort(results);
        return results.toArray(new String[0]);
    }
}
