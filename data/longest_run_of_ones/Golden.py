class LongestRunOfOnes:
    def longestRunOfOnes(self, n):
        max_run = 0
        current = 0
        while n > 0:
            if n & 1:
                current += 1
                if current > max_run:
                    max_run = current
            else:
                current = 0
            n >>= 1
        return max_run
