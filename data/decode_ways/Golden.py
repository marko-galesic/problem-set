class DecodeWays:
    def numDecodings(self, s):
        if not s:
            return 0
        prev2 = 1
        prev1 = 1 if s[0] != '0' else 0
        for i in range(1, len(s)):
            current = 0
            if s[i] != '0':
                current += prev1
            two = (ord(s[i - 1]) - 48) * 10 + (ord(s[i]) - 48)
            if 10 <= two <= 26:
                current += prev2
            prev2, prev1 = prev1, current
        return prev1
