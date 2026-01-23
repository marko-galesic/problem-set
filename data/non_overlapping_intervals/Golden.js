class NonOverlappingIntervals {
  eraseOverlapIntervals(intervals) {
    if (!Array.isArray(intervals) || intervals.length <= 1) {
      return 0;
    }

    intervals.sort((a, b) => {
      if (a[1] !== b[1]) {
        return a[1] - b[1];
      }
      return a[0] - b[0];
    });

    let removed = 0;
    let end = intervals[0][1];
    for (let i = 1; i < intervals.length; i++) {
      const start = intervals[i][0];
      const finish = intervals[i][1];
      if (start >= end) {
        end = finish;
      } else {
        removed += 1;
      }
    }

    return removed;
  }
}
