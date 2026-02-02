class FindAllAnagramsInAString:
    def findAnagrams(self, s, p):
        if len(s) < len(p):
            return []
        need = [0] * 26
        for ch in p:
            need[ord(ch) - 97] += 1
        window = [0] * 26
        required = sum(1 for v in need if v > 0)
        matches = 0
        result = []
        left = 0
        for right, ch in enumerate(s):
            idx = ord(ch) - 97
            window[idx] += 1
            if window[idx] == need[idx]:
                matches += 1
            if right - left + 1 > len(p):
                left_idx = ord(s[left]) - 97
                if window[left_idx] == need[left_idx]:
                    matches -= 1
                window[left_idx] -= 1
                left += 1
            if right - left + 1 == len(p) and matches == required:
                result.append(left)
        return result
