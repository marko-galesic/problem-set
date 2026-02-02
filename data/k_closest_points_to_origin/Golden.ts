class KClosestPointsToOrigin {
  kClosest(points, k) {
    if (!points || k <= 0) {
      return [];
    }
    const sorted = points.slice().sort((a, b) => {
      const da = a[0] * a[0] + a[1] * a[1];
      const db = b[0] * b[0] + b[1] * b[1];
      if (da !== db) {
        return da - db;
      }
      if (a[0] !== b[0]) {
        return a[0] - b[0];
      }
      return a[1] - b[1];
    });
    return sorted.slice(0, Math.min(k, sorted.length)).map(point => [point[0], point[1]]);
  }
}
