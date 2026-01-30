class EditDistance:
    def editDistance(self, word1, word2):
        m = len(word1)
        n = len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            c1 = word1[i - 1]
            for j in range(1, n + 1):
                c2 = word2[j - 1]
                if c1 == c2:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    replace = dp[i - 1][j - 1]
                    delete = dp[i - 1][j]
                    insert = dp[i][j - 1]
                    dp[i][j] = 1 + min(replace, delete, insert)
        return dp[m][n]
