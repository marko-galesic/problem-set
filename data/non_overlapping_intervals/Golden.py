class NonOverlappingIntervals:
    def eraseOverlapIntervals(self, intervals):
        if not intervals or len(intervals) <= 1:
            return 0

        intervals.sort(key=lambda pair: (pair[1], pair[0]))

        removed = 0
        end = intervals[0][1]
        for start, finish in intervals[1:]:
            if start >= end:
                end = finish
            else:
                removed += 1

        return removed
