class RottingOranges {
  orangesRotting(grid) {
    if (!Array.isArray(grid) || grid.length === 0) return 0;
    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [];
    let fresh = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 2) {
          queue.push([r, c]);
        } else if (grid[r][c] === 1) {
          fresh++;
        }
      }
    }
    let minutes = 0;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    while (queue.length && fresh > 0) {
      const size = queue.length;
      for (let i = 0; i < size; i++) {
        const [r, c] = queue.shift();
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && grid[nr][nc] === 1) {
            grid[nr][nc] = 2;
            fresh--;
            queue.push([nr, nc]);
          }
        }
      }
      minutes++;
    }
    return fresh === 0 ? minutes : -1;
  }
}
