class InsertInterval:
    def insert(self, intervals, newInterval):
        if not intervals:
            return [newInterval]

        merged = []
        i = 0
        start, end = newInterval

        while i < len(intervals) and intervals[i][1] < start:
            merged.append(intervals[i])
            i += 1

        while i < len(intervals) and intervals[i][0] <= end:
            start = min(start, intervals[i][0])
            end = max(end, intervals[i][1])
            i += 1

        merged.append([start, end])

        while i < len(intervals):
            merged.append(intervals[i])
            i += 1

        return merged
