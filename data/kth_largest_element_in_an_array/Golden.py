class KthLargestElementInAnArray:
    def findKthLargest(self, nums, k):
        if not nums or k <= 0 or k > len(nums):
            return 0
        sorted_nums = sorted(nums, reverse=True)
        return sorted_nums[k - 1]
