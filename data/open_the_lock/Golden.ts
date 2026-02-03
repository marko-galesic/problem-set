class OpenTheLock {
  openLock(deadends, target) {
    const dead = new Set(deadends || []);
    const start = "0000";
    if (dead.has(start)) return -1;
    if (target === start) return 0;
    const queue = [start];
    let head = 0;
    const seen = new Set([start]);
    let steps = 0;
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const cur = queue[head++];
        if (cur === target) return steps;
        for (let pos = 0; pos < 4; pos++) {
          const digit = cur.charCodeAt(pos) - 48;
          for (const delta of [1, -1]) {
            const nd = (digit + delta + 10) % 10;
            const next = cur.slice(0, pos) + nd + cur.slice(pos + 1);
            if (!dead.has(next) && !seen.has(next)) {
              seen.add(next);
              queue.push(next);
            }
          }
        }
      }
      steps++;
    }
    return -1;
  }
}
