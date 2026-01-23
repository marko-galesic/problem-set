class CountWords:
    def countWords(self, s):
        return len(s.strip().split()) if s.strip() else 0
