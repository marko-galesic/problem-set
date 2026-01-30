class MissingNumber:
    def missingNumber(self, nums):
        xor_val = len(nums)
        for i, n in enumerate(nums):
            xor_val ^= i ^ n
        return xor_val
