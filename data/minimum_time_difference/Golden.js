class MinimumTimeDifference {
  findMinDifference(timePoints) {
    const minutes = timePoints.map((t) => {
      const hour = parseInt(t.slice(0, 2), 10);
      const minute = parseInt(t.slice(3), 10);
      return hour * 60 + minute;
    });
    minutes.sort((a, b) => a - b);
    let minDiff = 1440;
    for (let i = 1; i < minutes.length; i++) {
      minDiff = Math.min(minDiff, minutes[i] - minutes[i - 1]);
    }
    minDiff = Math.min(minDiff, 1440 - minutes[minutes.length - 1] + minutes[0]);
    return minDiff;
  }
}
