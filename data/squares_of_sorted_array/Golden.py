class SquaresOfSortedArray:
    def sortedSquares(self, nums):
        n = len(nums)
        result = [0] * n
        left = 0
        right = n - 1
        write = n - 1
        while left <= right:
            left_val = nums[left]
            right_val = nums[right]
            left_sq = left_val * left_val
            right_sq = right_val * right_val
            if left_sq > right_sq:
                result[write] = left_sq
                left += 1
            else:
                result[write] = right_sq
                right -= 1
            write -= 1
        return result
