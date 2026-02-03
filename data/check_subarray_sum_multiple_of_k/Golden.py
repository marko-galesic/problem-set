class CheckSubarraySumMultipleOfK:
    def checkSubarraySum(self, nums, k):
        if not nums or len(nums) < 2:
            return False
        if k == 0:
            for i in range(1, len(nums)):
                if nums[i] == 0 and nums[i - 1] == 0:
                    return True
            return False
        seen = {0: -1}
        acc = 0
        for i, n in enumerate(nums):
            acc += n
            mod = acc % k
            if mod in seen:
                if i - seen[mod] >= 2:
                    return True
            else:
                seen[mod] = i
        return False
