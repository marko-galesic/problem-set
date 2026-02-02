class LongestMountainInArray:
    def longestMountainInArray(self, nums):
        n = len(nums)
        best = 0
        i = 1
        while i < n - 1:
            if nums[i - 1] < nums[i] > nums[i + 1]:
                left = i - 1
                right = i + 1
                while left > 0 and nums[left - 1] < nums[left]:
                    left -= 1
                while right < n - 1 and nums[right] > nums[right + 1]:
                    right += 1
                best = max(best, right - left + 1)
                i = right
            i += 1
        return best