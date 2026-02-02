class ImplementTrie {
  trieOps(ops, words) {
    const node = () => ({ next: new Array(26).fill(null), isWord: false });
    const root = node();

    const insert = (word) => {
      let cur = root;
      for (let i = 0; i < word.length; i++) {
        const idx = word.charCodeAt(i) - 97;
        if (!cur.next[idx]) {
          cur.next[idx] = node();
        }
        cur = cur.next[idx];
      }
      cur.isWord = true;
    };

    const search = (word) => {
      let cur = root;
      for (let i = 0; i < word.length; i++) {
        const idx = word.charCodeAt(i) - 97;
        if (!cur.next[idx]) {
          return false;
        }
        cur = cur.next[idx];
      }
      return cur.isWord;
    };

    const startsWith = (prefix) => {
      let cur = root;
      for (let i = 0; i < prefix.length; i++) {
        const idx = prefix.charCodeAt(i) - 97;
        if (!cur.next[idx]) {
          return false;
        }
        cur = cur.next[idx];
      }
      return true;
    };

    const results = [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      const arg = words[i];
      if (op === 'insert') {
        insert(arg);
      } else if (op === 'search') {
        results.push(search(arg) ? 1 : 0);
      } else if (op === 'startsWith') {
        results.push(startsWith(arg) ? 1 : 0);
      }
    }
    return results;
  }
}
