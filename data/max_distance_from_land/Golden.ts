class MaxDistanceFromLand {
  maxDistance(grid) {
    if (!Array.isArray(grid) || grid.length === 0) return -1;
    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [];
    let landCount = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 1) {
          queue.push([r, c]);
          landCount++;
        }
      }
    }
    const total = rows * cols;
    if (landCount === 0 || landCount === total) return -1;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    for (const [r, c] of queue) {
      visited[r][c] = true;
    }
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    let head = 0;
    let dist = -1;
    while (head < queue.length) {
      const size = queue.length - head;
      dist++;
      for (let i = 0; i < size; i++) {
        const [r, c] = queue[head++];
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (visited[nr][nc]) continue;
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return dist;
  }
}
