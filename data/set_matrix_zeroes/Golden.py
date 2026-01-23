class SetMatrixZeroes:
    def setZeroes(self, matrix):
        if matrix is None:
            return matrix
        if len(matrix) == 0:
            return []

        rows = len(matrix)
        cols = len(matrix[0]) if matrix[0] is not None else 0
        zero_rows = [False] * rows
        zero_cols = [False] * cols

        for r in range(rows):
            for c in range(cols):
                if matrix[r][c] == 0:
                    zero_rows[r] = True
                    zero_cols[c] = True

        for r in range(rows):
            for c in range(cols):
                if zero_rows[r] or zero_cols[c]:
                    matrix[r][c] = 0

        return matrix
