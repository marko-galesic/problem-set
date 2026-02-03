class ShortestBridge {
  shortestBridge(grid) {
    const rows = grid.length;
    const cols = rows ? grid[0].length : 0;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const queue = [];
    const dirs = [[1,0], [-1,0], [0,1], [0,-1]];

    const dfs = (r, c) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
      }
      if (visited[r][c] || grid[r][c] === 0) {
        return;
      }
      visited[r][c] = true;
      queue.push([r, c]);
      for (const [dr, dc] of dirs) {
        dfs(r + dr, c + dc);
      }
    };

    let found = false;
    for (let r = 0; r < rows && !found; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 1) {
          dfs(r, c);
          found = true;
          break;
        }
      }
    }

    let steps = 0;
    while (queue.length) {
      const size = queue.length;
      for (let i = 0; i < size; i++) {
        const [r, c] = queue.shift();
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
            continue;
          }
          if (visited[nr][nc]) {
            continue;
          }
          if (grid[nr][nc] === 1) {
            return steps;
          }
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
      steps++;
    }
    return -1;
  }
}
