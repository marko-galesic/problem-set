class FirstNonRepeatingChar:
    def firstNonRepeatingChar(self, s):
        counts = {}
        for ch in s:
            counts[ch] = counts.get(ch, 0) + 1
        for i, ch in enumerate(s):
            if counts.get(ch, 0) == 1:
                return i
        return -1
