class MaximumXorOfTwoNumbers {
  _insert(root, num) {
    let node = root;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >>> i) & 1;
      if (!node.next[bit]) {
        node.next[bit] = { next: [null, null] };
      }
      node = node.next[bit];
    }
  }

  _query(root, num) {
    let node = root;
    let value = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >>> i) & 1;
      const want = bit ^ 1;
      if (node.next[want]) {
        value |= (1 << i);
        node = node.next[want];
      } else {
        node = node.next[bit];
      }
    }
    return value;
  }

  findMaximumXOR(nums) {
    const root = { next: [null, null] };
    for (const num of nums) {
      this._insert(root, num);
    }
    let maxVal = 0;
    for (const num of nums) {
      maxVal = Math.max(maxVal, this._query(root, num));
    }
    return maxVal;
  }
}
