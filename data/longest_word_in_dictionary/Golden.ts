class LongestWordInDictionary {
  _buildable(word, set) {
    for (let i = 1; i < word.length; i++) {
      if (!set.has(word.slice(0, i))) {
        return false;
      }
    }
    return true;
  }

  longestWord(words) {
    const set = new Set(words);
    let best = '';
    for (const word of words) {
      if (this._buildable(word, set)) {
        if (word.length > best.length || (word.length === best.length && word < best)) {
          best = word;
        }
      }
    }
    return best;
  }
}
