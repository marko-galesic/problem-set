from collections import deque


class WordLadderPathsCount:
    def ladderPathCount(self, beginWord, endWord, wordList):
        if beginWord == endWord:
            return 1
        word_set = set(wordList or [])
        if endWord not in word_set:
            return 0
        dist = {beginWord: 0}
        queue = deque([beginWord])
        while queue:
            word = queue.popleft()
            d = dist[word]
            if word == endWord:
                continue
            chars = list(word)
            for i, original in enumerate(chars):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    if c == original:
                        continue
                    chars[i] = c
                    nxt = ''.join(chars)
                    if nxt in word_set and nxt not in dist:
                        dist[nxt] = d + 1
                        queue.append(nxt)
                chars[i] = original
        if endWord not in dist:
            return 0
        memo = {}

        def dfs(word):
            if word == endWord:
                return 1
            if word in memo:
                return memo[word]
            total = 0
            d = dist.get(word, 10**9)
            chars = list(word)
            for i, original in enumerate(chars):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    if c == original:
                        continue
                    chars[i] = c
                    nxt = ''.join(chars)
                    if nxt in word_set and dist.get(nxt, -1) == d + 1:
                        total += dfs(nxt)
                chars[i] = original
            memo[word] = total
            return total

        return dfs(beginWord)
