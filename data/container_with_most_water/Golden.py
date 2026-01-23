class ContainerWithMostWater:
    def maxArea(self, height):
        if not height or len(height) < 2:
            return 0
        left = 0
        right = len(height) - 1
        best = 0
        while left < right:
            left_height = height[left]
            right_height = height[right]
            min_height = left_height if left_height < right_height else right_height
            area = min_height * (right - left)
            if area > best:
                best = area
            if left_height <= right_height:
                left += 1
            else:
                right -= 1
        return best
