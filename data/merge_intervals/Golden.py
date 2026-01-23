class MergeIntervals:
    def merge(self, intervals):
        if intervals is None or len(intervals) == 0:
            return []

        intervals.sort(key=lambda x: (x[0], x[1]))
        merged = []
        current = [intervals[0][0], intervals[0][1]]

        for start, end in intervals[1:]:
            if start <= current[1]:
                if end > current[1]:
                    current[1] = end
            else:
                merged.append(current)
                current = [start, end]

        merged.append(current)
        return merged
