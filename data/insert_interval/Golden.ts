class InsertInterval {
  insert(intervals, newInterval) {
    if (!Array.isArray(intervals) || intervals.length === 0) {
      return [newInterval];
    }

    const merged = [];
    let i = 0;
    let start = newInterval[0];
    let end = newInterval[1];

    while (i < intervals.length && intervals[i][1] < start) {
      merged.push(intervals[i]);
      i += 1;
    }

    while (i < intervals.length && intervals[i][0] <= end) {
      start = Math.min(start, intervals[i][0]);
      end = Math.max(end, intervals[i][1]);
      i += 1;
    }

    merged.push([start, end]);

    while (i < intervals.length) {
      merged.push(intervals[i]);
      i += 1;
    }

    return merged;
  }
}
