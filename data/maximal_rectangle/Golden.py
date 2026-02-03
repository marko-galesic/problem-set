class MaximalRectangle:
    def maximalRectangle(self, matrix):
        if not matrix:
            return 0
        rows = len(matrix)
        cols = len(matrix[0])
        heights = [0] * cols
        best = 0
        for r in range(rows):
            for c in range(cols):
                if matrix[r][c] == '1':
                    heights[c] += 1
                else:
                    heights[c] = 0
            stack = []
            for i in range(cols + 1):
                h = heights[i] if i < cols else 0
                while stack and h < heights[stack[-1]]:
                    height = heights[stack.pop()]
                    width = i if not stack else i - stack[-1] - 1
                    best = max(best, height * width)
                stack.append(i)
        return best
