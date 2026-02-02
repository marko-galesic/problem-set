class DiagonalTraverse:
    def diagonalTraverse(self, matrix):
        if not matrix:
            return []
        m = len(matrix)
        n = len(matrix[0])
        result = []
        for d in range(m + n - 1):
            temp = []
            r = 0 if d < n else d - n + 1
            c = d if d < n else n - 1
            while r < m and c >= 0:
                temp.append(matrix[r][c])
                r += 1
                c -= 1
            if d % 2 == 0:
                temp.reverse()
            result.extend(temp)
        return result