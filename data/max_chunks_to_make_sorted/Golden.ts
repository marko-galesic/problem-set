class MaxChunksToMakeSorted {
  maxChunksToSorted(arr) {
    let maxVal = -Infinity;
    let chunks = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > maxVal) {
        maxVal = arr[i];
      }
      if (maxVal === i) {
        chunks++;
      }
    }
    return chunks;
  }
}
