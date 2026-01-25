class CountDigitsInString:
    def countDigitsInString(self, s):
        count = 0
        for ch in s:
            if '0' <= ch <= '9':
                count += 1
        return count
