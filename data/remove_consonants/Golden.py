class RemoveConsonants:
    def removeConsonants(self, s):
        out = []
        for ch in s:
            lower = ch.lower()
            if 'a' <= lower <= 'z':
                if lower in 'aeiou':
                    out.append(ch)
            else:
                out.append(ch)
        return ''.join(out)
