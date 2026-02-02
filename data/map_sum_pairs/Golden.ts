class MapSumPairs {
  mapSumOps(ops, keys, vals) {
    const node = () => ({ next: new Array(26).fill(null), sum: 0 });
    const root = node();
    const values = new Map();

    const insert = (key, val) => {
      const prev = values.has(key) ? values.get(key) : 0;
      const delta = val - prev;
      values.set(key, val);
      let cur = root;
      cur.sum += delta;
      for (let i = 0; i < key.length; i++) {
        const idx = key.charCodeAt(i) - 97;
        if (!cur.next[idx]) {
          cur.next[idx] = node();
        }
        cur = cur.next[idx];
        cur.sum += delta;
      }
    };

    const sumPrefix = (prefix) => {
      let cur = root;
      for (let i = 0; i < prefix.length; i++) {
        const idx = prefix.charCodeAt(i) - 97;
        if (!cur.next[idx]) {
          return 0;
        }
        cur = cur.next[idx];
      }
      return cur.sum;
    };

    const results = [];
    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === 'insert') {
        insert(keys[i], vals[i]);
      } else if (ops[i] === 'sum') {
        results.push(sumPrefix(keys[i]));
      }
    }
    return results;
  }
}
