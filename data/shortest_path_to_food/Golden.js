class ShortestPathToFood {
  shortestPathToFood(grid) {
    if (!Array.isArray(grid) || grid.length === 0) return -1;
    const rows = grid.length;
    const cols = grid[0].length;
    let sr = -1;
    let sc = -1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === '*') {
          sr = r;
          sc = c;
        }
      }
    }
    if (sr === -1) return -1;
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
        if (grid[r][c] === '#') return steps;
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (visited[nr][nc] || grid[nr][nc] === 'X') continue;
          if (grid[nr][nc] === '#') return steps + 1;
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
      steps++;
    }
    return -1;
  }
}
