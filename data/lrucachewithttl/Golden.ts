class LRUCache {
  constructor(capacity, ttlMillis) {
    this.capacity = capacity;
    this.ttlMillis = ttlMillis;
    this.map = new Map();
    this.head = { prev: null, next: null };
    this.tail = { prev: this.head, next: null };
    this.head.next = this.tail;
  }

  _now() {
    return Date.now();
  }

  _isExpired(node) {
    if (node.expiresAt === null || node.expiresAt === undefined) {
      return false;
    }
    return this._now() >= node.expiresAt;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _moveToFront(node) {
    this._remove(node);
    this._addToFront(node);
  }

  get(key) {
    if (!this.map.has(key)) {
      return -1;
    }
    const node = this.map.get(key);
    if (this._isExpired(node)) {
      this._remove(node);
      this.map.delete(key);
      return -1;
    }
    this._moveToFront(node);
    return node.value;
  }

  put(key, value) {
    if (this.capacity <= 0) {
      return;
    }
    const now = this._now();
    const expiresAt = this.ttlMillis === null || this.ttlMillis === undefined
      ? null
      : now + this.ttlMillis;

    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      node.expiresAt = expiresAt;
      if (this._isExpired(node)) {
        this._remove(node);
        this.map.delete(key);
        return;
      }
      this._moveToFront(node);
      return;
    }

    if (this.map.size >= this.capacity) {
      const lru = this.tail.prev;
      if (lru && lru !== this.head) {
        this._remove(lru);
        this.map.delete(lru.key);
      }
    }

    const node = { key, value, expiresAt, prev: null, next: null };
    this._addToFront(node);
    if (!this._isExpired(node)) {
      this.map.set(key, node);
    } else {
      this._remove(node);
    }
  }
}
