class WordGraphDistances {
  wordGraphDistances(words, start) {
    if (!Array.isArray(words)) return null;
    const n = words.length;
    const dist = Array(n).fill(-1);
    const startIndex = words.indexOf(start);
    if (startIndex === -1) return dist;
    const queue = [startIndex];
    let head = 0;
    dist[startIndex] = 0;
    while (head < queue.length) {
      const idx = queue[head++];
      for (let j = 0; j < n; j++) {
        if (dist[j] !== -1) continue;
        if (this.isNeighbor(words[idx], words[j])) {
          dist[j] = dist[idx] + 1;
          queue.push(j);
        }
      }
    }
    return dist;
  }

  isNeighbor(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        diff++;
        if (diff > 1) return false;
      }
    }
    return diff === 1;
  }
}
