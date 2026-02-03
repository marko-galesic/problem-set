class WordLadderLength {
  ladderLength(beginWord, endWord, wordList) {
    if (beginWord === endWord) return 1;
    const wordSet = new Set(wordList || []);
    if (!wordSet.has(endWord)) return 0;
    const queue = [beginWord];
    let head = 0;
    let steps = 1;
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const word = queue[head++];
        if (word === endWord) return steps;
        for (let p = 0; p < word.length; p++) {
          const prefix = word.slice(0, p);
          const suffix = word.slice(p + 1);
          for (let c = 97; c <= 122; c++) {
            const ch = String.fromCharCode(c);
            if (ch === word[p]) continue;
            const next = prefix + ch + suffix;
            if (wordSet.has(next)) {
              wordSet.delete(next);
              queue.push(next);
            }
          }
        }
      }
      steps++;
    }
    return 0;
  }
}
