class LongestPalindromeLength:
    def longestPalindromeLength(self, s):
        counts = {}
        for ch in s:
            counts[ch] = counts.get(ch, 0) + 1
        length = 0
        odd = False
        for count in counts.values():
            length += (count // 2) * 2
            if count % 2 == 1:
                odd = True
        return length + (1 if odd else 0)