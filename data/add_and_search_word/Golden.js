class AddAndSearchWord {
  wordDictionaryOps(ops, words) {
    const node = () => ({ next: new Array(26).fill(null), isWord: false });
    const root = node();

    const add = (word) => {
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

    const search = (cur, word, index) => {
      if (!cur) {
        return false;
      }
      if (index === word.length) {
        return cur.isWord;
      }
      const ch = word[index];
      if (ch === '.') {
        for (let i = 0; i < 26; i++) {
          if (cur.next[i] && search(cur.next[i], word, index + 1)) {
            return true;
          }
        }
        return false;
      }
      const idx = ch.charCodeAt(0) - 97;
      return search(cur.next[idx], word, index + 1);
    };

    const results = [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      const arg = words[i];
      if (op === 'add') {
        add(arg);
      } else if (op === 'search') {
        results.push(search(root, arg, 0) ? 1 : 0);
      }
    }
    return results;
  }
}
