class MergeIntervals {
  merge(intervals) {
    if (!Array.isArray(intervals) || intervals.length === 0) {
      return [];
    }

    const sorted = intervals
      .map((interval) => interval.slice())
      .sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

    const merged = [];
    let current = [sorted[0][0], sorted[0][1]];

    for (let i = 1; i < sorted.length; i++) {
      const start = sorted[i][0];
      const end = sorted[i][1];
      if (start <= current[1]) {
        if (end > current[1]) {
          current[1] = end;
        }
      } else {
        merged.push(current);
        current = [start, end];
      }
    }

    merged.push(current);
    return merged;
  }
}
