class ColumnSums:
    def columnSums(self, matrix):
        if not matrix:
            return []
        rows = len(matrix)
        cols = len(matrix[0]) if rows else 0
        sums = [0] * cols
        for r in range(rows):
            for c in range(cols):
                sums[c] += matrix[r][c]
        return sums
