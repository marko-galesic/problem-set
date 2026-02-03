class WallsAndGates {
  wallsAndGates(rooms) {
    if (!Array.isArray(rooms)) return null;
    if (rooms.length === 0) return [];
    const rows = rooms.length;
    const cols = rooms[0].length;
    const queue = [];
    let head = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rooms[r][c] === 0) {
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
        if (rooms[nr][nc] !== 2147483647) continue;
        rooms[nr][nc] = rooms[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
    return rooms;
  }
}
