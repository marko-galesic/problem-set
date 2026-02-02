class ShortestPathInBinaryMatrix {
  shortestPathBinaryMatrix(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
      return -1;
    }
    const rows = grid.length;
    const cols = grid[0].length;
    if (grid[0][0] !== 0 || grid[rows - 1][cols - 1] !== 0) {
      return -1;
    }
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const queue = [[0, 0, 1]];
    visited[0][0] = true;
    let head = 0;
    while (head < queue.length) {
      const [r, c, dist] = queue[head++];
      if (r === rows - 1 && c === cols - 1) {
        return dist;
      }
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] === 0) {
          visited[nr][nc] = true;
          queue.push([nr, nc, dist + 1]);
        }
      }
    }
    return -1;
  }
}
