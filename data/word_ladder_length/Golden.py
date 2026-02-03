from collections import deque


class WordLadderLength:
    def ladderLength(self, beginWord, endWord, wordList):
        if beginWord == endWord:
            return 1
        word_set = set(wordList or [])
        if endWord not in word_set:
            return 0
        queue = deque([beginWord])
        steps = 1
        while queue:
            for _ in range(len(queue)):
                word = queue.popleft()
                if word == endWord:
                    return steps
                chars = list(word)
                for i, original in enumerate(chars):
                    for c in 'abcdefghijklmnopqrstuvwxyz':
                        if c == original:
                            continue
                        chars[i] = c
                        nxt = ''.join(chars)
                        if nxt in word_set:
                            word_set.remove(nxt)
                            queue.append(nxt)
                    chars[i] = original
            steps += 1
        return 0
