class ReplaceWords {
  _buildTrie(dictionary) {
    const root = { next: new Array(26).fill(null), isWord: false };
    for (const word of dictionary) {
      let node = root;
      for (let i = 0; i < word.length; i++) {
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

  _replace(root, word) {
    let node = root;
    let prefix = '';
    for (let i = 0; i < word.length; i++) {
      const idx = word.charCodeAt(i) - 97;
      if (!node.next[idx]) {
        return word;
      }
      node = node.next[idx];
      prefix += word[i];
      if (node.isWord) {
        return prefix;
      }
    }
    return word;
  }

  replaceWords(dictionary, sentence) {
    const root = this._buildTrie(dictionary);
    const parts = sentence.split(' ');
    const replaced = parts.map((word) => this._replace(root, word));
    return replaced.join(' ');
  }
}
