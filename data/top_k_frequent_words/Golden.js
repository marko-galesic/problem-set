class TopKFrequentWords {
  topKFrequent(words, k) {
    const freq = new Map();
    for (const word of words) {
      freq.set(word, (freq.get(word) || 0) + 1);
    }
    const sorted = Array.from(freq.keys()).sort((a, b) => {
      const fa = freq.get(a);
      const fb = freq.get(b);
      if (fa !== fb) return fb - fa;
      return a.localeCompare(b);
    });
    return sorted.slice(0, k);
  }
}
