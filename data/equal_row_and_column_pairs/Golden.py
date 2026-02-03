class EqualRowAndColumnPairs:
    def equalPairs(self, grid):
        n = len(grid)
        row_counts = {}
        for r in range(n):
            key = tuple(grid[r])
            row_counts[key] = row_counts.get(key, 0) + 1
        total = 0
        for c in range(n):
            col = tuple(grid[r][c] for r in range(n))
            total += row_counts.get(col, 0)
        return total
