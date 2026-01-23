class LongestWordLength:
    def longestWordLength(self, words):
        return max((len(word) for word in words), default=0)
