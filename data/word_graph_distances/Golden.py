from collections import deque


class WordGraphDistances:
    def wordGraphDistances(self, words, start):
        if words is None:
            return None
        n = len(words)
        dist = [-1] * n
        try:
            start_index = words.index(start)
        except ValueError:
            return dist
        queue = deque([start_index])
        dist[start_index] = 0
        while queue:
            idx = queue.popleft()
            for j in range(n):
                if dist[j] != -1:
                    continue
                if self.is_neighbor(words[idx], words[j]):
                    dist[j] = dist[idx] + 1
                    queue.append(j)
        return dist

    def is_neighbor(self, a, b):
        if len(a) != len(b):
            return False
        diff = 0
        for i in range(len(a)):
            if a[i] != b[i]:
                diff += 1
                if diff > 1:
                    return False
        return diff == 1
