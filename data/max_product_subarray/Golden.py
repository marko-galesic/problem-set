class MaxProductSubarray:
    def maxProductSubarray(self, nums):
        if not nums:
            return 0
        max_prod = min_prod = ans = nums[0]
        for n in nums[1:]:
            if n < 0:
                max_prod, min_prod = min_prod, max_prod
            max_prod = max(n, max_prod * n)
            min_prod = min(n, min_prod * n)
            ans = max(ans, max_prod)
        return ans