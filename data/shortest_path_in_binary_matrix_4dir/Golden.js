class ShortestPathInBinaryMatrix4Dir {
  shortestPathBinaryMatrix4Dir(grid) {
    if (!Array.isArray(grid) || grid.length === 0) return -1;
    const rows = grid.length;
    const cols = grid[0].length;
    if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) return -1;
    if (rows === 1 && cols === 1) return 0;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const queue = [[0, 0]];
    let head = 0;
    visited[0][0] = true;
    let steps = 0;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    while (head < queue.length) {
      const size = queue.length - head;
      for (let i = 0; i < size; i++) {
        const [r, c] = queue[head++];
        if (r === rows - 1 && c === cols - 1) return steps;
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (visited[nr][nc] || grid[nr][nc] === 1) continue;
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
      steps++;
    }
    return -1;
  }
}
