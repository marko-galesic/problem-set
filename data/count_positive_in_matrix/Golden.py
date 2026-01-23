class CountPositiveInMatrix:
    def countPositiveInMatrix(self, matrix):
        return sum(1 for row in matrix for value in row if value > 0)
