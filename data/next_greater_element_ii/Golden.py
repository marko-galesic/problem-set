class NextGreaterElementII:
    def nextGreaterElements(self, nums):
        n = len(nums)
        result = [-1] * n
        stack = []
        for i in range(2 * n):
            idx = i % n
            while stack and nums[idx] > nums[stack[-1]]:
                result[stack.pop()] = nums[idx]
            if i < n:
                stack.append(idx)
        return result
