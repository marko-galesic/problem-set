class SearchInRotatedSortedArray:
    def search(self, nums, target):
        if not nums:
            return -1
        left = 0
        right = len(nums) - 1
        while left <= right:
            mid = left + (right - left) // 2
            value = nums[mid]
            if value == target:
                return mid
            if nums[left] <= value:
                if nums[left] <= target < value:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                if value < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1
        return -1
