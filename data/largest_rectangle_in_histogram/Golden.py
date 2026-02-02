class LargestRectangleInHistogram:
    def largestRectangleArea(self, heights):
        n = len(heights)
        max_area = 0
        stack = []
        for i in range(n + 1):
            h = 0 if i == n else heights[i]
            while stack and h < heights[stack[-1]]:
                height = heights[stack.pop()]
                width = i if not stack else i - stack[-1] - 1
                max_area = max(max_area, height * width)
            stack.append(i)
        return max_area
