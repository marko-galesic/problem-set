class StringRunLengthEncode:
    def stringRunLengthEncode(self, s):
        if not s:
            return ''
        parts = []
        count = 1
        for i in range(1, len(s)):
            if s[i] == s[i - 1]:
                count += 1
            else:
                parts.append(f"{s[i - 1]}{count}")
                count = 1
        parts.append(f"{s[-1]}{count}")
        return ''.join(parts)