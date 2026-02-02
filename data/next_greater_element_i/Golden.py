class NextGreaterElementI:
    def nextGreaterElement(self, nums1, nums2):
        next_map = {}
        stack = []
        for num in nums2:
            while stack and num > stack[-1]:
                next_map[stack.pop()] = num
            stack.append(num)
        while stack:
            next_map[stack.pop()] = -1
        return [next_map.get(num, -1) for num in nums1]
