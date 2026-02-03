class MaxChunksToMakeSorted:
    def maxChunksToSorted(self, arr):
        max_val = -10**9
        chunks = 0
        for i, n in enumerate(arr):
            if n > max_val:
                max_val = n
            if max_val == i:
                chunks += 1
        return chunks
