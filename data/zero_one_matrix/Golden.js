class ZeroOneMatrix {
  updateMatrix(mat) {
    if (!Array.isArray(mat)) return null;
    const rows = mat.length;
    if (rows === 0) return [];
    const cols = mat[0].length;
    const dist = Array.from({ length: rows }, () => Array(cols).fill(-1));
    const queue = [];
    let head = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (mat[r][c] === 0) {
          dist[r][c] = 0;
          queue.push([r, c]);
        }
      }
    }
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    while (head < queue.length) {
      const [r, c] = queue[head++];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (dist[nr][nc] !== -1) continue;
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
    return dist;
  }
}
