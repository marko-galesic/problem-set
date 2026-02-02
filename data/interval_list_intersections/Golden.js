class IntervalListIntersections {
  intervalIntersection(firstList, secondList) {
    if (!firstList || !secondList || firstList.length === 0 || secondList.length === 0) {
      return [];
    }
    const result = [];
    let i = 0;
    let j = 0;
    while (i < firstList.length && j < secondList.length) {
      const start = Math.max(firstList[i][0], secondList[j][0]);
      const end = Math.min(firstList[i][1], secondList[j][1]);
      if (start <= end) {
        result.push([start, end]);
      }
      if (firstList[i][1] < secondList[j][1]) {
        i++;
      } else {
        j++;
      }
    }
    return result;
  }
}
