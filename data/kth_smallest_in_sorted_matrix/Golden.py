class KthSmallestInSortedMatrix:
    def kthSmallest(self, matrix, k):
        rows = len(matrix)
        cols = len(matrix[0])
        low = matrix[0][0]
        high = matrix[rows - 1][cols - 1]

        def count_less_or_equal(value):
            row = rows - 1
            col = 0
            count = 0
            while row >= 0 and col < cols:
                if matrix[row][col] <= value:
                    count += row + 1
                    col += 1
                else:
                    row -= 1
            return count

        while low < high:
            mid = (low + high) // 2
            if count_less_or_equal(mid) < k:
                low = mid + 1
            else:
                high = mid
        return low
