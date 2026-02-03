from collections import Counter


class ReorganizeString:
    def reorganizeString(self, s):
        freq = Counter(s)
        chars = sorted(freq.keys())
        result = []
        prev = None
        n = len(s)
        for pos in range(n):
            placed = False
            for ch in chars:
                if freq[ch] == 0 or ch == prev:
                    continue
                freq[ch] -= 1
                remaining = n - pos - 1
                max_count = max(freq.values(), default=0)
                if max_count <= (remaining + 1) // 2:
                    result.append(ch)
                    prev = ch
                    placed = True
                    break
                freq[ch] += 1
            if not placed:
                return ""
        return ''.join(result)
