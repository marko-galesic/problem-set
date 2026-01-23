class DiagonalSum:
    def diagonalSum(self, matrix):
        if not matrix:
            return 0
        rows = len(matrix)
        cols = len(matrix[0]) if rows else 0
        limit = min(rows, cols)
        total = 0
        for i in range(limit):
            total += matrix[i][i]
        return total
