class NumberOfEnclaves {
  numEnclaves(grid) {
    const rows = grid.length;
    const cols = rows ? grid[0].length : 0;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const queue = [];

    for (let r = 0; r < rows; r++) {
      if (grid[r][0] === 1) {
        visited[r][0] = true;
        queue.push([r, 0]);
      }
      if (cols > 1 && grid[r][cols - 1] === 1 && !visited[r][cols - 1]) {
        visited[r][cols - 1] = true;
        queue.push([r, cols - 1]);
      }
    }
    for (let c = 0; c < cols; c++) {
      if (grid[0][c] === 1 && !visited[0][c]) {
        visited[0][c] = true;
        queue.push([0, c]);
      }
      if (rows > 1 && grid[rows - 1][c] === 1 && !visited[rows - 1][c]) {
        visited[rows - 1][c] = true;
        queue.push([rows - 1, c]);
      }
    }

    const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
    while (queue.length) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
          continue;
        }
        if (grid[nr][nc] === 1 && !visited[nr][nc]) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }

    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 1 && !visited[r][c]) {
          count++;
        }
      }
    }
    return count;
  }
}
