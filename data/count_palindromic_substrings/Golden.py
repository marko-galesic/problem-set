class CountPalindromicSubstrings:
    def countPalindromicSubstrings(self, s):
        def expand(l, r):
            count = 0
            while l >= 0 and r < len(s) and s[l] == s[r]:
                count += 1
                l -= 1
                r += 1
            return count

        total = 0
        for i in range(len(s)):
            total += expand(i, i)
            total += expand(i, i + 1)
        return total