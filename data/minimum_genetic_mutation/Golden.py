from collections import deque


class MinimumGeneticMutation:
    def minMutation(self, start, end, bank):
        if start == end:
            return 0
        word_set = set(bank or [])
        if end not in word_set:
            return -1
        genes = ['A', 'C', 'G', 'T']
        queue = deque([start])
        steps = 0
        while queue:
            for _ in range(len(queue)):
                word = queue.popleft()
                if word == end:
                    return steps
                chars = list(word)
                for i, original in enumerate(chars):
                    for g in genes:
                        if g == original:
                            continue
                        chars[i] = g
                        nxt = ''.join(chars)
                        if nxt in word_set:
                            word_set.remove(nxt)
                            queue.append(nxt)
                    chars[i] = original
            steps += 1
        return -1
