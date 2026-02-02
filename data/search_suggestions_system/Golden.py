class SearchSuggestionsSystem:
    def suggestedProducts(self, products, searchWord):
        products = sorted(products)
        result = []
        prefix = ""
        for ch in searchWord:
            prefix += ch
            suggestions = []
            # linear scan from first product >= prefix
            lo, hi = 0, len(products)
            while lo < hi:
                mid = (lo + hi) // 2
                if products[mid] < prefix:
                    lo = mid + 1
                else:
                    hi = mid
            i = lo
            while i < len(products) and len(suggestions) < 3:
                if products[i].startswith(prefix):
                    suggestions.append(products[i])
                else:
                    break
                i += 1
            result.append(suggestions)
        return result
