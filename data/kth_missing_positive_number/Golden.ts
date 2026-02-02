class KthMissingPositiveNumber {
  kthMissingPositiveNumber(arr, k) {
    let current = 1;
    let i = 0;
    while (true) {
      if (i < arr.length && arr[i] === current) {
        i++;
      } else {
        k--;
        if (k === 0) {
          return current;
        }
      }
      current++;
    }
  }
}
