class MinimumDeletionsToMakeStringBalanced:
    def minimumDeletions(self, s):
        deletions = 0
        count_b = 0
        for ch in s:
            if ch == 'a':
                deletions = min(deletions + 1, count_b)
            elif ch == 'b':
                count_b += 1
        return deletions
