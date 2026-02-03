class WordLadderPathsCount {
  ladderPathCount(beginWord, endWord, wordList) {
    if (beginWord === endWord) return 1;
    const wordSet = new Set(wordList || []);
    if (!wordSet.has(endWord)) return 0;
    const dist = new Map();
    const queue = [beginWord];
    let head = 0;
    dist.set(beginWord, 0);
    while (head < queue.length) {
      const word = queue[head++];
      const d = dist.get(word);
      if (word === endWord) continue;
      for (let i = 0; i < word.length; i++) {
        const prefix = word.slice(0, i);
        const suffix = word.slice(i + 1);
        for (let c = 97; c <= 122; c++) {
          const ch = String.fromCharCode(c);
          if (ch === word[i]) continue;
          const next = prefix + ch + suffix;
          if (wordSet.has(next) && !dist.has(next)) {
            dist.set(next, d + 1);
            queue.push(next);
          }
        }
      }
    }
    if (!dist.has(endWord)) return 0;
    const memo = new Map();
    const dfs = (word) => {
      if (word === endWord) return 1;
      if (memo.has(word)) return memo.get(word);
      const d = dist.get(word);
      let total = 0;
      for (let i = 0; i < word.length; i++) {
        const prefix = word.slice(0, i);
        const suffix = word.slice(i + 1);
        for (let c = 97; c <= 122; c++) {
          const ch = String.fromCharCode(c);
          if (ch === word[i]) continue;
          const next = prefix + ch + suffix;
          if (wordSet.has(next) && dist.get(next) === d + 1) {
            total += dfs(next);
          }
        }
      }
      memo.set(word, total);
      return total;
    };
    return dfs(beginWord);
  }
}
