class ShortestUnsortedContinuousSubarray:
    def findUnsortedSubarray(self, nums):
        n = len(nums)
        left = n
        right = 0
        stack = []

        for i in range(n):
            while stack and nums[stack[-1]] > nums[i]:
                left = min(left, stack.pop())
            stack.append(i)

        stack.clear()
        for i in range(n - 1, -1, -1):
            while stack and nums[stack[-1]] < nums[i]:
                right = max(right, stack.pop())
            stack.append(i)

        if right <= left:
            return 0
        return right - left + 1
