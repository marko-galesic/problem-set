class ReverseWordsInString:
    def reverseWordsInString(self, s):
        if s is None or len(s) == 0:
            return "" if s is None else s
        parts = s.split(" ")
        parts.reverse()
        return " ".join(parts)
