class TransposeMatrix:
    def transposeMatrix(self, matrix):
        if not matrix:
            return []
        rows = len(matrix)
        cols = len(matrix[0]) if rows else 0
        return [[matrix[r][c] for r in range(rows)] for c in range(cols)]
