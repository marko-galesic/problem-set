class LongestCommonPrefix:
    def longestCommonPrefix(self, strs):
        if not strs:
            return ""
        prefix = "" if strs[0] is None else str(strs[0])
        for value in strs[1:]:
            current = "" if value is None else str(value)
            while prefix and not current.startswith(prefix):
                prefix = prefix[:-1]
            if not prefix:
                return ""
        return prefix
