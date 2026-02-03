class LongestCommonSubstring:
    def longestCommonSubstring(self, a, b):
        if not a or not b:
            return 0
        n = len(b)
        dp = [0] * (n + 1)
        best = 0
        for i in range(1, len(a) + 1):
            prev = 0
            for j in range(1, n + 1):
                temp = dp[j]
                if a[i - 1] == b[j - 1]:
                    dp[j] = prev + 1
                    if dp[j] > best:
                        best = dp[j]
                else:
                    dp[j] = 0
                prev = temp
        return best
