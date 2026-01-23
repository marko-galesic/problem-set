class TopKFrequentWords:
    def topKFrequent(self, words, k):
        freq = {}
        for word in words:
            freq[word] = freq.get(word, 0) + 1

        sorted_words = sorted(freq.keys(), key=lambda w: (-freq[w], w))
        return sorted_words[:k]
