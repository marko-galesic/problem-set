class PrefixAndSuffixSearch:
    def prefixSuffixSearch(self, words, queries):
        result = []
        for query in queries:
            if '|' in query:
                prefix, suffix = query.split('|', 1)
            else:
                prefix, suffix = query, ""
            best = -1
            for i, word in enumerate(words):
                if word.startswith(prefix) and word.endswith(suffix):
                    best = i
            result.append(best)
        return result
