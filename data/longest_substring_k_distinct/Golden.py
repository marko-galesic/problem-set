class LongestSubstringKDistinct:
    def longestSubstringKDistinct(self, s, k):
        if k <= 0:
            return 0
        left = 0
        counts = {}
        best = 0
        for right, ch in enumerate(s):
            counts[ch] = counts.get(ch, 0) + 1
            while len(counts) > k:
                c = s[left]
                counts[c] -= 1
                if counts[c] == 0:
                    del counts[c]
                left += 1
            best = max(best, right - left + 1)
        return best