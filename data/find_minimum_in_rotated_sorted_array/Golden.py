class FindMinimumInRotatedSortedArray:
    def findMin(self, nums):
        if not nums:
            return 0
        left = 0
        right = len(nums) - 1
        while left < right:
            mid = left + (right - left) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        return nums[left]
