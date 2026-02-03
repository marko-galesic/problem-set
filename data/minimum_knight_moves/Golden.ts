class MinimumKnightMoves {
  minKnightMoves(n, start, end) {
    if (n <= 0) return -1;
    const [sr, sc] = start;
    const [tr, tc] = end;
    if (sr === tr && sc === tc) return 0;
    const moves = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
    const visited = Array.from({ length: n }, () => Array(n).fill(false));
    const queue = [[sr, sc]];
    let head = 0;
    visited[sr][sc] = true;
    let steps = 0;
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const [r, c] = queue[head++];
        if (r === tr && c === tc) return steps;
        for (const [dr, dc] of moves) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
          if (visited[nr][nc]) continue;
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
      steps++;
    }
    return -1;
  }
}
