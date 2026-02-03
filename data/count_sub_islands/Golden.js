class CountSubIslands {
  countSubIslands(grid1, grid2) {
    const rows = grid2.length;
    const cols = rows ? grid2[0].length : 0;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const dirs = [[1,0], [-1,0], [0,1], [0,-1]];

    const dfs = (r, c) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return true;
      }
      if (grid2[r][c] === 0 || visited[r][c]) {
        return true;
      }
      visited[r][c] = true;
      let isSub = grid1[r][c] === 1;
      for (const [dr, dc] of dirs) {
        if (!dfs(r + dr, c + dc)) {
          isSub = false;
        }
      }
      return isSub;
    };

    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid2[r][c] === 1 && !visited[r][c]) {
          if (dfs(r, c)) {
            count++;
          }
        }
      }
    }
    return count;
  }
}
