class ContainsDuplicate:
    def containsDuplicate(self, nums):
        if nums is None:
            return False
        seen = set()
        for num in nums:
            if num in seen:
                return True
            seen.add(num)
        return False
