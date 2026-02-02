class LongestWordInDictionary:
    def _buildable(self, word, word_set):
        for i in range(1, len(word)):
            if word[:i] not in word_set:
                return False
        return True

    def longestWord(self, words):
        word_set = set(words)
        best = ""
        for word in words:
            if self._buildable(word, word_set):
                if len(word) > len(best) or (len(word) == len(best) and word < best):
                    best = word
        return best
