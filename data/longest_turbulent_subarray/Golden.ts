class LongestTurbulentSubarray {
  maxTurbulenceSize(arr) {
    if (!arr || arr.length === 0) {
      return 0;
    }
    let up = 1;
    let down = 1;
    let best = 1;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > arr[i - 1]) {
        up = down + 1;
        down = 1;
      } else if (arr[i] < arr[i - 1]) {
        down = up + 1;
        up = 1;
      } else {
        up = 1;
        down = 1;
      }
      best = Math.max(best, up, down);
    }
    return best;
  }
}
