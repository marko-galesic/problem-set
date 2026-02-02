class MaximumXorOfTwoNumbers {
    private static class Node {
        Node[] next = new Node[2];
    }

    private void insert(Node root, int num) {
        Node node = root;
        for (int i = 31; i >= 0; i -= 1) {
            int bit = (num >>> i) & 1;
            if (node.next[bit] == null) {
                node.next[bit] = new Node();
            }
            node = node.next[bit];
        }
    }

    private int query(Node root, int num) {
        Node node = root;
        int value = 0;
        for (int i = 31; i >= 0; i -= 1) {
            int bit = (num >>> i) & 1;
            int want = bit ^ 1;
            if (node.next[want] != null) {
                value |= (1 << i);
                node = node.next[want];
            } else {
                node = node.next[bit];
            }
        }
        return value;
    }

    public int findMaximumXOR(int[] nums) {
        Node root = new Node();
        for (int num : nums) {
            insert(root, num);
        }
        int max = 0;
        for (int num : nums) {
            max = Math.max(max, query(root, num));
        }
        return max;
    }
}
