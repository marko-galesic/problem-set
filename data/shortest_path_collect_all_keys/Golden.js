class ShortestPathCollectAllKeys {
  shortestPathAllKeys(grid) {
    if (!Array.isArray(grid) || grid.length === 0) return -1;
    const rows = grid.length;
    const cols = grid[0].length;
    let sr = 0;
    let sc = 0;
    let targetMask = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ch = grid[r][c];
        if (ch === '@') {
          sr = r;
          sc = c;
        } else if (ch >= 'a' && ch <= 'f') {
          targetMask |= 1 << (ch.charCodeAt(0) - 97);
        }
      }
    }
    if (targetMask === 0) return 0;
    const maxMask = 1 << 6;
    const visited = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Array(maxMask).fill(false))
    );
    const queue = [[sr, sc, 0]];
    let head = 0;
    visited[sr][sc][0] = true;
    let steps = 0;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const [r, c, mask] = queue[head++];
        if (mask === targetMask) return steps;
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          const cell = grid[nr][nc];
          if (cell === '#') continue;
          if (cell >= 'A' && cell <= 'F') {
            const bit = cell.charCodeAt(0) - 65;
            if ((mask & (1 << bit)) === 0) continue;
          }
          let nextMask = mask;
          if (cell >= 'a' && cell <= 'f') {
            nextMask |= 1 << (cell.charCodeAt(0) - 97);
          }
          if (!visited[nr][nc][nextMask]) {
            visited[nr][nc][nextMask] = true;
            queue.push([nr, nc, nextMask]);
          }
        }
      }
      steps++;
    }
    return -1;
  }
}
