class ThreeSum:
    def threeSum(self, nums):
        if nums is None or len(nums) < 3:
            return []

        nums.sort()
        results = []
        n = len(nums)

        for i in range(n - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            if nums[i] > 0:
                break

            left = i + 1
            right = n - 1

            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if total == 0:
                    results.append([nums[i], nums[left], nums[right]])
                    left_val = nums[left]
                    right_val = nums[right]
                    while left < right and nums[left] == left_val:
                        left += 1
                    while left < right and nums[right] == right_val:
                        right -= 1
                elif total < 0:
                    left += 1
                else:
                    right -= 1

        return results
