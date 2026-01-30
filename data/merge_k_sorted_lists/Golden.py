class MergeKSortedLists:
    def mergeKSortedLists(self, lists):
        if lists is None:
            return []
        values = []
        for lst in lists:
            if lst is None:
                continue
            for val in lst:
                values.append(val)
        values.sort()
        return values
