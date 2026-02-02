class StreamOfCharacters {
  _buildTrie(words) {
    const root = { next: new Array(26).fill(null), isWord: false };
    for (const word of words) {
      let node = root;
      for (let i = word.length - 1; i >= 0; i--) {
        const idx = word.charCodeAt(i) - 97;
        if (!node.next[idx]) {
          node.next[idx] = { next: new Array(26).fill(null), isWord: false };
        }
        node = node.next[idx];
      }
      node.isWord = true;
    }
    return root;
  }

  streamQueries(words, queries) {
    const root = this._buildTrie(words);
    let maxLen = 0;
    for (const word of words) {
      maxLen = Math.max(maxLen, word.length);
    }
    const stream = [];
    const results = [];
    for (const q of queries) {
      stream.push(q[0]);
      if (stream.length > maxLen) {
        stream.splice(0, stream.length - maxLen);
      }
      let node = root;
      let found = false;
      for (let i = stream.length - 1; i >= 0; i--) {
        const idx = stream[i].charCodeAt(0) - 97;
        node = node.next[idx];
        if (!node) {
          break;
        }
        if (node.isWord) {
          found = true;
          break;
        }
      }
      results.push(found ? 1 : 0);
    }
    return results;
  }
}
