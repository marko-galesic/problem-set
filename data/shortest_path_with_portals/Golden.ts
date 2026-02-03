class ShortestPathWithPortals {
  shortestPathWithPortals(grid) {
    if (!Array.isArray(grid) || grid.length === 0) return -1;
    const rows = grid.length;
    const cols = grid[0].length;
    let sr = -1;
    let sc = -1;
    let tr = -1;
    let tc = -1;
    const portals = new Map();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ch = grid[r][c];
        if (ch === 'S') {
          sr = r;
          sc = c;
        } else if (ch === 'E') {
          tr = r;
          tc = c;
        } else if (ch >= 'a' && ch <= 'z') {
          if (!portals.has(ch)) portals.set(ch, []);
          portals.get(ch).push([r, c]);
        }
      }
    }
    if (sr === -1 || tr === -1) return -1;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const queue = [[sr, sc]];
    let head = 0;
    visited[sr][sc] = true;
    let steps = 0;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const [r, c] = queue[head++];
        if (r === tr && c === tc) return steps;
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          const next = grid[nr][nc];
          if (next === '#') continue;
          let fr = nr;
          let fc = nc;
          if (next >= 'a' && next <= 'z') {
            const list = portals.get(next) || [];
            if (list.length === 2) {
              const [a, b] = list;
              if (a[0] === nr && a[1] === nc) {
                fr = b[0];
                fc = b[1];
              } else {
                fr = a[0];
                fc = a[1];
              }
            }
          }
          if (!visited[fr][fc]) {
            visited[fr][fc] = true;
            queue.push([fr, fc]);
          }
        }
      }
      steps++;
    }
    return -1;
  }
}
