class LRUCache {

    class Node {
        Node prev, next;
        int key, value;
        long expiry;

        Node(int key, int value, long expiry) {
            this.key = key;
            this.value = value;
            this.expiry = expiry;
        }
    }

    int capacity;
    long ttl;
    Map<Integer, Node> nodes;

    Node head;
    Node tail;

    public LRUCache(int capacity, long ttl) {
        this.capacity = capacity;
        this.ttl = ttl;
        this.nodes = new HashMap<>();
    }

    public int get(int key) {
        Node n = nodes.get(key);
        if (n == null) return -1;

        long now = TestClock.currentTimeMillis();

        if (n.expiry <= now) {
            detachNode(n);
            nodes.remove(key);
            return -1;
        }

        if (n != head) {
            detachNode(n);
            attachToHead(n);
        }

        return n.value;
    }

    public void put(int key, int value) {
        if (capacity == 0) return;

        long now = TestClock.currentTimeMillis();

        Node n = nodes.get(key);
        if (n != null) {
            if (n.expiry <= now) {
                detachNode(n);
                nodes.remove(n.key);
                n = null;
            } else {
                n.value = value;
                n.expiry = now + ttl;
                if (n != head) {
                    detachNode(n);
                    attachToHead(n);
                }
                return;
            }
        }

        while (tail != null && tail.expiry <= now) {
            nodes.remove(tail.key);
            detachNode(tail);
        }

        if (nodes.size() == capacity) {
            Node t = tail;
            detachNode(t);
            nodes.remove(t.key);
        }

        n = new Node(key, value, now + ttl);
        attachToHead(n);
        nodes.put(key, n);
    }

    private void detachNode(Node n) {
        Node prev = n.prev;
        Node next = n.next;

        if (prev != null) prev.next = next;
        else head = next;

        if (next != null) next.prev = prev;
        else tail = prev;

        n.prev = null;
        n.next = null;
    }

    private void attachToHead(Node n) {
        n.prev = null;
        n.next = head;

        if (head != null) head.prev = n;
        head = n;

        if (tail == null) tail = n;
    }
}