class CountSubarraysWithEvenSum:
    def countSubarraysWithEvenSum(self, nums):
        even = 1
        odd = 0
        total = 0
        running = 0
        for n in nums:
            running += n
            if running % 2 == 0:
                total += even
                even += 1
            else:
                total += odd
                odd += 1
        return total