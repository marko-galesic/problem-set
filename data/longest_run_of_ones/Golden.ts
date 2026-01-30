class LongestRunOfOnes {
  longestRunOfOnes(n) {
    let maxRun = 0;
    let current = 0;
    while (n > 0) {
      if ((n & 1) === 1) {
        current++;
        if (current > maxRun) maxRun = current;
      } else {
        current = 0;
      }
      n = n >>> 1;
    }
    return maxRun;
  }
}
