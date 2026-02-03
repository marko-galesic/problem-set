class GroupShiftedStrings:
    def groupShiftedStrings(self, strings):
        from collections import defaultdict

        def key(s):
            if s == '':
                return ''
            base = ord(s[0])
            diffs = [(ord(c) - base) % 26 for c in s]
            return '#'.join(str(d) for d in diffs)

        groups = defaultdict(list)
        for s in strings:
            groups[key(s)].append(s)
        result = []
        for group in groups.values():
            group.sort()
            result.append(group)
        result.sort(key=lambda g: g[0] if g else '')
        return result
