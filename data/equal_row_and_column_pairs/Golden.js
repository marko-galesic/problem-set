class EqualRowAndColumnPairs {
  equalPairs(grid) {
    const n = grid.length;
    const rowCounts = new Map();
    for (let r = 0; r < n; r++) {
      const key = grid[r].join(',');
      rowCounts.set(key, (rowCounts.get(key) || 0) + 1);
    }
    let total = 0;
    for (let c = 0; c < n; c++) {
      const col = [];
      for (let r = 0; r < n; r++) {
        col.push(grid[r][c]);
      }
      const key = col.join(',');
      total += rowCounts.get(key) || 0;
    }
    return total;
  }
}
