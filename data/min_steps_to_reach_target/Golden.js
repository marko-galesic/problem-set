class MinStepsToReachTarget {
  minStepsToReachTarget(start, target) {
    if (start === target) return 0;
    let max = Math.max(start, target) * 2 + 2;
    if (max < 2) max = 2;
    if (start < 0 || start > max) return -1;
    const visited = Array(max + 1).fill(false);
    const queue = [start];
    let head = 0;
    visited[start] = true;
    let steps = 0;
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const cur = queue[head++];
        if (cur === target) return steps;
        const nexts = [cur - 1, cur + 1, cur * 2];
        for (const nxt of nexts) {
          if (nxt < 0 || nxt > max) continue;
          if (!visited[nxt]) {
            visited[nxt] = true;
            queue.push(nxt);
          }
        }
      }
      steps++;
    }
    return -1;
  }
}
