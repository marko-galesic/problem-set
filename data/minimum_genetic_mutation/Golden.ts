class MinimumGeneticMutation {
  minMutation(start, end, bank) {
    if (start === end) return 0;
    const wordSet = new Set(bank || []);
    if (!wordSet.has(end)) return -1;
    const genes = ['A', 'C', 'G', 'T'];
    const queue = [start];
    let head = 0;
    let steps = 0;
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const word = queue[head++];
        if (word === end) return steps;
        const chars = word.split('');
        for (let p = 0; p < chars.length; p++) {
          const original = chars[p];
          for (const g of genes) {
            if (g === original) continue;
            chars[p] = g;
            const next = chars.join('');
            if (wordSet.has(next)) {
              wordSet.delete(next);
              queue.push(next);
            }
          }
          chars[p] = original;
        }
      }
      steps++;
    }
    return -1;
  }
}
