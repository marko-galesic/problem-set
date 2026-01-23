class PermutationInString:
    def checkInclusion(self, s1, s2):
        if len(s1) > len(s2):
            return False
        need = [0] * 26
        window = [0] * 26
        for ch in s1:
            need[ord(ch) - ord('a')] += 1
        for i in range(len(s1)):
            window[ord(s2[i]) - ord('a')] += 1
        if window == need:
            return True
        for i in range(len(s1), len(s2)):
            window[ord(s2[i]) - ord('a')] += 1
            window[ord(s2[i - len(s1)]) - ord('a')] -= 1
            if window == need:
                return True
        return False
