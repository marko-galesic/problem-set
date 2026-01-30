class IslandPerimeter {
  islandPerimeter(grid) {
    if (!grid || grid.length === 0) return 0;
    const rows = grid.length;
    const cols = grid[0].length;
    let perimeter = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 1) {
          perimeter += 4;
          if (r > 0 && grid[r - 1][c] === 1) perimeter -= 2;
          if (c > 0 && grid[r][c - 1] === 1) perimeter -= 2;
        }
      }
    }
    return perimeter;
  }
}
